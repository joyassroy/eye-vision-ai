import sys
import os
sys.path.append(os.path.abspath("backend"))

import gradio as gr
import spaces
from backend.main import app as fastapi_app

@spaces.GPU
def dummy_gpu_function():
    return "EyeVision AI API Backend is running successfully on ZeroGPU!"

# Create a simple Gradio interface using the GPU-decorated function
demo = gr.Interface(
    fn=dummy_gpu_function,
    inputs=None,
    outputs="text",
    title="EyeVision AI Backend"
)

# Mount the Gradio app on a sub-path, so that the main "/" and "/api" paths are handled by our FastAPI backend
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
