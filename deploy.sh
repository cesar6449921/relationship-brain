#!/bin/bash

# Configuration
SERVICE_NAME="bot-brain"
REGION="us-central1"

# Check for required env vars
if [ -z "$GOOGLE_API_KEY" ] || [ -z "$EVOLUTION_URL" ] || [ -z "$EVOLUTION_API_KEY" ]; then
    echo "Error: Environment variables GOOGLE_API_KEY, EVOLUTION_URL, and EVOLUTION_API_KEY must be set."
    exit 1
fi

echo "🚀 Building container..."
gcloud builds submit --tag gcr.io/$(gcloud config get-value project)/$SERVICE_NAME ./src

echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$(gcloud config get-value project)/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --max-instances 1 \
    --memory 512Mi \
    --set-env-vars "GOOGLE_API_KEY=$GOOGLE_API_KEY" \
    --set-env-vars "EVOLUTION_URL=$EVOLUTION_URL" \
    --set-env-vars "EVOLUTION_API_KEY=$EVOLUTION_API_KEY"

echo "✅ Deployment complete!"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
