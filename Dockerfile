FROM python:3.12-slim

WORKDIR /app


# Copy backend requirements and install them
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY backend /app/backend

# Set the working directory to backend so the app runs in the correct context
WORKDIR /app/backend

# Hugging Face Spaces exposes port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
