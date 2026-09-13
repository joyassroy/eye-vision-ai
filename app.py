import sys
import os
sys.path.append(os.path.abspath("backend"))

import gradio as gr
from backend.main import app as fastapi_app

# Create a simple Gradio interface just to satisfy Hugging Face's requirements
demo = gr.Interface(
    fn=lambda: "EyeVision AI API Backend is running successfully!",
    inputs=None,
    outputs="text",
    title="EyeVision AI Backend"
)

# Mount the Gradio app on a sub-path, so that the main "/" and "/api" paths are handled by our FastAPI backend
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
