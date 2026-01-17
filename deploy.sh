#!/bin/bash

# Configuration
SERVICE_NAME="bot-brain"
REGION="us-central1"

# Fetch Project ID
PROJECT_ID=$(gcloud config get-value project)

# Check for required env vars
if [ -z "$EVOLUTION_URL" ] || [ -z "$EVOLUTION_API_KEY" ]; then
    echo "Error: Environment variables EVOLUTION_URL and EVOLUTION_API_KEY must be set."
    exit 1
fi

if [ -z "$PROJECT_ID" ]; then
    echo "Error: Could not determine Google Cloud Project ID. Run 'gcloud config set project YOUR_PROJECT_ID'."
    exit 1
fi

echo "🚀 Building container for project $PROJECT_ID..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME ./src

echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --max-instances 1 \
    --memory 512Mi \
    --set-env-vars "EVOLUTION_URL=$EVOLUTION_URL" \
    --set-env-vars "EVOLUTION_API_KEY=$EVOLUTION_API_KEY" \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=$PROJECT_ID" \
    --set-env-vars "GOOGLE_CLOUD_LOCATION=$REGION"

echo "✅ Deployment complete!"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
