from __future__ import annotations

from pathlib import Path
from typing import Optional

import cv2
import numpy as np
import torch
from torch import nn


def slugify(value: str) -> str:
    cleaned = "".join(character.lower() if character.isalnum() else "-" for character in value)
    while "--" in cleaned:
        cleaned = cleaned.replace("--", "-")
    return cleaned.strip("-") or "class"


def find_last_convolutional_feature_layer(model: nn.Module) -> nn.Module:
    selected_module: nn.Module | None = None
    selected_name: str | None = None

    for name, module in model.named_modules():
        if name.startswith("features") and isinstance(module, nn.Conv2d):
            selected_module = module
            selected_name = name

    if selected_module is not None:
        setattr(selected_module, "_gradcam_name", selected_name)
        return selected_module

    for name, module in reversed(list(model.named_modules())):
        if name.startswith("features") and isinstance(module, nn.Conv2d):
            setattr(module, "_gradcam_name", name)
            return module

    raise RuntimeError("Unable to locate a convolutional feature layer for Grad-CAM.")


class GradCAM:
    def __init__(self, model: nn.Module, target_layer: nn.Module) -> None:
        self.model = model
        self.target_layer = target_layer
        self.activations: Optional[torch.Tensor] = None
        self.gradients: Optional[torch.Tensor] = None
        self._forward_handle = self.target_layer.register_forward_hook(self._forward_hook)

    def close(self) -> None:
        if self._forward_handle is not None:
            self._forward_handle.remove()
            self._forward_handle = None

    def __del__(self) -> None:
        self.close()

    def _forward_hook(self, module, inputs, output):  # type: ignore[override]
        self.activations = output
        if isinstance(output, torch.Tensor) and output.requires_grad:
            output.register_hook(self._save_gradients)

    def _save_gradients(self, gradients: torch.Tensor) -> None:
        self.gradients = gradients

    def generate(
        self,
        input_tensor: torch.Tensor,
        target_index: int,
        original_rgb_image: np.ndarray,
    ) -> dict[str, np.ndarray]:
        self.model.zero_grad(set_to_none=True)
        self.activations = None
        self.gradients = None

        logits = self.model(input_tensor)
        score = logits[:, target_index].sum()
        score.backward(retain_graph=False)

        if self.activations is None or self.gradients is None:
            raise RuntimeError("Grad-CAM hooks did not capture activations and gradients.")

        activations = self.activations.detach()
        gradients = self.gradients.detach()
        weights = gradients.mean(dim=(2, 3), keepdim=True)
        cam = (weights * activations).sum(dim=1).squeeze(0)
        cam = torch.relu(cam)
        cam = cam.cpu().numpy()

        cam -= cam.min()
        max_value = cam.max()
        if max_value > 0:
            cam /= max_value

        height, width = original_rgb_image.shape[:2]
        cam = cv2.resize(cam, (width, height))
        heatmap = np.uint8(255 * cam)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        original_bgr = cv2.cvtColor(original_rgb_image, cv2.COLOR_RGB2BGR)
        overlay = cv2.addWeighted(original_bgr, 0.60, heatmap, 0.40, 0)
        return {
            'heatmap_rgb': cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB),
            'overlay_rgb': cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB),
        }


def save_image(image_rgb: np.ndarray, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)
    cv2.imwrite(str(output_path), image_bgr)
