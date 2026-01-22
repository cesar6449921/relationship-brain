FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Environment variables (default)
# Environment variables (default)
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Run with Uvicorn in production mode
# Uses shell form to allow variable expansion for $PORT
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1 --proxy-headers --log-level info --access-log
