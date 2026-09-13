from __future__ import annotations

import uuid
from contextlib import asynccontextmanager
from io import BytesIO
from pathlib import Path
from time import perf_counter
from typing import Any

import numpy as np
import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError

from gradcam import GradCAM, find_last_convolutional_feature_layer, save_image, slugify
from model import ModelBundle, build_preprocess, load_model_bundle


MAX_UPLOAD_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


BACKEND_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BACKEND_DIR / "uploads"
RESULTS_DIR = BACKEND_DIR / "results"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def sanitize_filename(filename: str | None) -> str:
    if not filename:
        return "image"
    return Path(filename).name or "image"


def validate_threshold(value: str | None) -> float:
    if value is None or value == "":
        return 0.5
    try:
        threshold = float(value)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail="Threshold must be a number between 0 and 1.") from exc

    if not 0.0 <= threshold <= 1.0:
        raise HTTPException(status_code=422, detail="Threshold must be between 0 and 1.")
    return threshold


def validate_target_class(value: str | None) -> str | None:
    if value is None:
        return None
    normalized = value.strip()
    return normalized or None


def validate_image_extension(filename: str) -> None:
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail="Unsupported image format. Use JPG, JPEG, PNG, or WEBP.",
        )


def verify_and_open_image(image_bytes: bytes) -> Image.Image:
    try:
        image = Image.open(BytesIO(image_bytes))
        image.verify()
        image = Image.open(BytesIO(image_bytes))
        return image.convert("RGB")
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.") from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Unable to read the uploaded image.") from exc


def load_runtime() -> dict[str, Any]:
    bundle = load_model_bundle()
    preprocess = build_preprocess(bundle.image_size, bundle.mean, bundle.std)
    target_layer = find_last_convolutional_feature_layer(bundle.model)
    gradcam = GradCAM(bundle.model, target_layer)

    return {
        "bundle": bundle,
        "preprocess": preprocess,
        "gradcam": gradcam,
        "target_layer_name": getattr(target_layer, "_gradcam_name", target_layer.__class__.__name__),
    }


@asynccontextmanager
async def lifespan(app: FastAPI):
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    def download_model_if_missing():
        model_path = BACKEND_DIR.parent / "public" / "WEBSITE_MODEL" / "best_model.pth"
        if not model_path.exists():
            print(f"Model not found locally at {model_path}. Downloading from Google Drive...")
            model_path.parent.mkdir(parents=True, exist_ok=True)
            import gdown
            file_id = "1HjyJ-fIBUE5WYQNHsaDdHTynRTZwg5jc"
            gdown.download(id=file_id, output=str(model_path), quiet=False)
            print("Download complete.")
        else:
            print("Model found locally. Skipping download.")

    try:
        download_model_if_missing()
        runtime = load_runtime()
    except Exception as exc:
        print("=" * 50)
        print("EyeVision AI Backend")
        print("Model: EfficientNet-V2-M")
        print("Status: Failed to load")
        print("=" * 50)
        raise RuntimeError(f"Failed to load the model bundle: {exc}") from exc

    app.state.runtime = runtime
    bundle: ModelBundle = runtime["bundle"]
    device_name = str(bundle.device)

    print("=" * 50)
    print("EyeVision AI Backend")
    print("=" * 50)
    print("Model: EfficientNet-V2-M")
    print(f"Classes: {len(bundle.classes)}")
    print(f"Image Size: {bundle.image_size}")
    print(f"Device: {device_name}")
    print("Status: Ready")
    print("=" * 50)

    try:
        yield
    finally:
        gradcam = app.state.runtime.get("gradcam")
        if gradcam is not None:
            gradcam.close()


app = FastAPI(title="EyeVision AI Backend", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.mount("/results", StaticFiles(directory=str(RESULTS_DIR)), name="results")


def get_runtime() -> dict[str, Any]:
    runtime = getattr(app.state, "runtime", None)
    if runtime is None:
        raise HTTPException(status_code=503, detail="Model is not ready.")
    return runtime


def build_probability_map(classes: list[str], probabilities: list[float]) -> dict[str, float]:
    return {label: round(float(probability), 6) for label, probability in zip(classes, probabilities)}


def generate_response_payload(
    bundle: ModelBundle,
    probabilities: np.ndarray,
    threshold: float,
    original_image: Image.Image,
    selected_target_class: str | None,
    filename: str,
) -> dict[str, Any]:
    class_names = bundle.classes
    sorted_indices = list(np.argsort(probabilities)[::-1])
    detections = [index for index in sorted_indices if float(probabilities[index]) >= threshold]

    predictions = [
        {
            "disease": class_names[index],
            "confidence": round(float(probabilities[index]), 4),
        }
        for index in detections
    ]

    top_index = int(sorted_indices[0])
    top_prediction = class_names[top_index]
    top_confidence = round(float(probabilities[top_index]), 4)

    if not predictions and top_prediction.lower() == "normal":
        predictions = [
            {
                "disease": top_prediction,
                "confidence": top_confidence,
            }
        ]

    all_probabilities = build_probability_map(class_names, probabilities.tolist())

    target_class = selected_target_class or top_prediction
    if target_class not in class_names:
        raise HTTPException(status_code=422, detail=f"Unknown target class: {target_class}")

    target_index = class_names.index(target_class)

    runtime = get_runtime()
    bundle = runtime["bundle"]
    preprocess = runtime["preprocess"]
    gradcam = runtime["gradcam"]

    image_tensor = preprocess(original_image).unsqueeze(0).to(bundle.device)
    rgb_image = np.array(original_image)

    with torch.enable_grad():
        visualization = gradcam.generate(image_tensor, target_index, rgb_image)

    safe_stem = Path(filename).stem or "image"
    unique_suffix = f"{slugify(target_class)}_{uuid.uuid4().hex[:8]}"
    heatmap_name = f"{safe_stem}_{unique_suffix}_heatmap.png"
    overlay_name = f"{safe_stem}_{unique_suffix}_overlay.png"
    heatmap_path = RESULTS_DIR / heatmap_name
    overlay_path = RESULTS_DIR / overlay_name
    save_image(visualization['heatmap_rgb'], heatmap_path)
    save_image(visualization['overlay_rgb'], overlay_path)

    return {
        "success": True,
        "filename": filename,
        "predictions": predictions,
        "top_prediction": top_prediction,
        "top_confidence": top_confidence,
        "all_probabilities": all_probabilities,
        "gradcam_url": f"/results/{heatmap_name}",
        "overlay_url": f"/results/{overlay_name}",
        "processing_time_ms": 0,
        "target_class": target_class,
        "threshold": threshold,
    }


@app.get("/api/health")
def health() -> dict[str, Any]:
    runtime = get_runtime()
    bundle: ModelBundle = runtime["bundle"]
    return {
        "status": "ok",
        "model": "EfficientNet-V2-M",
        "classes": len(bundle.classes),
    }


@app.get("/api/classes")
def get_classes() -> dict[str, Any]:
    runtime = get_runtime()
    bundle: ModelBundle = runtime["bundle"]
    return {
        "success": True,
        "classes": bundle.classes,
    }


@app.post("/api/predict")
async def predict_image(
    file: UploadFile = File(...),
    threshold: str | None = Form(default=None),
    target_class: str | None = Form(default=None),
) -> JSONResponse:
    runtime = get_runtime()
    bundle: ModelBundle = runtime["bundle"]

    if file.filename is None:
        raise HTTPException(status_code=400, detail="No file was uploaded.")

    filename = sanitize_filename(file.filename)
    validate_image_extension(filename)
    selected_threshold = validate_threshold(threshold)
    selected_target_class = validate_target_class(target_class)

    started = perf_counter()
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(image_bytes) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File is too large. Maximum size is 10 MB.")

    original_image = verify_and_open_image(image_bytes)

    with torch.no_grad():
        image_tensor = runtime["preprocess"](original_image).unsqueeze(0).to(bundle.device)
        logits = bundle.model(image_tensor)
        probabilities = torch.sigmoid(logits).squeeze(0).detach().cpu().numpy()

    response = generate_response_payload(
        bundle=bundle,
        probabilities=probabilities,
        threshold=selected_threshold,
        original_image=original_image,
        selected_target_class=selected_target_class,
        filename=filename,
    )
    response["processing_time_ms"] = int((perf_counter() - started) * 1000)

    return JSONResponse(content=response)


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"success": False, "detail": exc.detail})