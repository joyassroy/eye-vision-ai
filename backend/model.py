from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
import torch
from torch import nn
from torchvision import models, transforms


DEFAULT_CLASS_NAMES = [
    "Cataract",
    "Conjunctival cyst",
    "Conjunctival injection",
    "Corneal / Conjunctival tumor",
    "Corneal dystrophy",
    "Corneal scarring",
    "Intraocular lens",
    "Keratitis",
    "Lens dislocation",
    "Lens dislocation/Cataract",
    "Normal",
    "Pigmented nevus",
    "Pinguecula",
    "Pterygium",
    "Subconjunctival hemorrhage",
]

DEFAULT_MODEL_CONFIG = {
    "model_name": "efficientnet_v2_m",
    "image_size": 224,
    "num_classes": 15,
    "dropout": 0.3,
    "normalization": {
        "mean": [0.485, 0.456, 0.406],
        "std": [0.229, 0.224, 0.225],
    },
}


@dataclass
class ModelBundle:
    model: nn.Module
    classes: list[str]
    image_size: int
    device: torch.device
    mean: list[float]
    std: list[float]
    dropout: float
    model_path: Path
    classes_path: Path
    model_config_path: Path
    website_config_path: Path


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def default_model_dir() -> Path:
    return project_root() / "public" / "WEBSITE_MODEL"


def resolve_path(env_name: str, fallback: Path) -> Path:
    value = os.getenv(env_name)
    if value:
        return Path(value).expanduser().resolve()
    return fallback.resolve()


def read_json_file(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_class_names(classes_path: Path, fallback: list[str]) -> list[str]:
    if not classes_path.exists():
        return fallback[:]

    try:
        raw = np.load(classes_path, allow_pickle=True)
        items = raw.tolist() if hasattr(raw, "tolist") else list(raw)
        names = []
        for item in items:
            if isinstance(item, bytes):
                decoded = item.decode("utf-8", errors="ignore").strip()
            else:
                decoded = str(item).strip()
            if decoded:
                names.append(decoded)
        if names:
            return names
    except Exception:
        pass

    return fallback[:]


def load_model_config(model_config_path: Path, website_config_path: Path) -> dict[str, Any]:
    config = DEFAULT_MODEL_CONFIG.copy()
    config.update(read_json_file(model_config_path))

    website_config = read_json_file(website_config_path)
    normalization = config.get("normalization", {}).copy()
    normalization.update(website_config.get("normalization", {}))
    config["normalization"] = normalization
    config["website_config"] = website_config
    return config


def build_efficientnet_v2_m(num_classes: int, dropout: float) -> nn.Module:
    model = models.efficientnet_v2_m(weights=None)
    classifier_in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=dropout, inplace=True),
        nn.Linear(classifier_in_features, num_classes),
    )
    return model


def _strip_module_prefix(state_dict: dict[str, Any]) -> dict[str, Any]:
    return {
        key.replace("module.", "", 1) if key.startswith("module.") else key: value
        for key, value in state_dict.items()
    }


def load_state_dict_flexibly(model: nn.Module, state_dict: dict[str, Any]) -> None:
    try:
        model.load_state_dict(state_dict, strict=True)
        return
    except RuntimeError:
        pass

    model_state = model.state_dict()
    compatible_state = {
        key: value
        for key, value in state_dict.items()
        if key in model_state and hasattr(value, "shape") and model_state[key].shape == value.shape
    }

    model_state.update(compatible_state)
    model.load_state_dict(model_state, strict=False)


def extract_state_dict(checkpoint: Any) -> dict[str, Any] | None:
    if isinstance(checkpoint, nn.Module):
        return checkpoint.state_dict()

    if not isinstance(checkpoint, dict):
        return None

    candidate_keys = (
        "state_dict",
        "model_state_dict",
        "model",
        "net",
        "weights",
        "encoder_state_dict",
    )
    for key in candidate_keys:
        candidate = checkpoint.get(key)
        if isinstance(candidate, dict):
            return candidate

    if checkpoint and all(hasattr(value, "shape") or torch.is_tensor(value) for value in checkpoint.values()):
        return checkpoint

    return None


def load_model_bundle() -> ModelBundle:
    model_dir = resolve_path("MODEL_DIR", default_model_dir())
    model_path = resolve_path("MODEL_PATH", model_dir / "best_model.pth")
    classes_path = resolve_path("CLASSES_PATH", model_dir / "classes.npy")
    model_config_path = resolve_path("MODEL_CONFIG_PATH", model_dir / "model_config.json")
    website_config_path = resolve_path("WEBSITE_CONFIG_PATH", model_dir / "website_config.json")

    config = load_model_config(model_config_path, website_config_path)
    classes = load_class_names(classes_path, DEFAULT_CLASS_NAMES)
    num_classes = int(config.get("num_classes", len(classes)))
    if len(classes) != num_classes:
        classes = (classes[:num_classes] + DEFAULT_CLASS_NAMES)[:num_classes]

    image_size = int(config.get("image_size", 224))
    dropout = float(config.get("dropout", 0.3))
    normalization = config.get("normalization", {})
    mean = [float(value) for value in normalization.get("mean", DEFAULT_MODEL_CONFIG["normalization"]["mean"])]
    std = [float(value) for value in normalization.get("std", DEFAULT_MODEL_CONFIG["normalization"]["std"])]

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = build_efficientnet_v2_m(num_classes=num_classes, dropout=dropout)

    if not model_path.exists():
        raise FileNotFoundError(f"Model checkpoint not found: {model_path}")

    try:
        checkpoint = torch.load(model_path, map_location=device, weights_only=True, mmap=True)
    except Exception:
        try:
            checkpoint = torch.load(model_path, map_location=device, weights_only=True)
        except Exception:
            checkpoint = torch.load(model_path, map_location=device)

    state_dict = extract_state_dict(checkpoint)
    if state_dict is None:
        raise ValueError("Could not extract a state dict from the saved checkpoint.")

    state_dict = _strip_module_prefix(state_dict)

    load_state_dict_flexibly(model, state_dict)
    
    # Aggressive memory cleanup for 512MB environments like Render
    del state_dict
    del checkpoint
    import gc
    gc.collect()

    model.to(device)
    model.eval()

    return ModelBundle(
        model=model,
        classes=classes,
        image_size=image_size,
        device=device,
        mean=mean,
        std=std,
        dropout=dropout,
        model_path=model_path,
        classes_path=classes_path,
        model_config_path=model_config_path,
        website_config_path=website_config_path,
    )


def build_preprocess(image_size: int, mean: list[float], std: list[float]) -> transforms.Compose:
    return transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=mean, std=std),
        ]
    )
