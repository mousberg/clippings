#!/bin/bash

# PR Coverage Generator - Cloud Build Deployment Script
set -e

echo "🚀 PR Coverage Generator - Cloud Build Deployment"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1 > /dev/null; then
    echo "❌ Not authenticated with gcloud. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

# Get current project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project set. Please set your project:"
    echo "   gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Project: $PROJECT_ID"
echo "🔧 Checking required APIs..."

# Enable required APIs
echo "🔄 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com \
                      run.googleapis.com \
                      containerregistry.googleapis.com

echo "🏗️  Starting Cloud Build deployment..."
echo "   This will:"
echo "   • Build Docker image using Cloud Build"
echo "   • Push to gcr.io/$PROJECT_ID/pr-coverage-gen"
echo "   • Deploy to Cloud Run"
echo ""

# Submit build
gcloud builds submit --config cloudbuild.yaml

echo ""
echo "✅ Deployment complete!"

# Get service URL
SERVICE_URL=$(gcloud run services describe pr-coverage-gen \
    --region us-central1 \
    --format 'value(status.url)' 2>/dev/null || echo "")

if [ -n "$SERVICE_URL" ]; then
    echo "🌐 Service URL: $SERVICE_URL"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Set your Google API key:"
    echo "   gcloud run services update pr-coverage-gen \\"
    echo "     --region us-central1 \\"
    echo "     --set-env-vars GOOGLE_API_KEY=\"your-gemini-api-key\""
    echo ""
    echo "2. Test the service:"
    echo "   curl $SERVICE_URL/health"
    echo ""
    echo "3. Generate a Harry Styles coverage report:"
    echo "   curl -X POST \"$SERVICE_URL/generate-report\" \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -d '{\"subject\": \"Harry Styles\", \"max_articles\": 15}' \\"
    echo "     --output harry-styles-coverage.pdf"
else
    echo "⚠️  Could not retrieve service URL. Check deployment status:"
    echo "   gcloud run services list --platform managed"
fi

echo ""
echo "📚 View logs: gcloud builds list --limit=5"
echo "🔍 Service details: gcloud run services describe pr-coverage-gen --region us-central1" 