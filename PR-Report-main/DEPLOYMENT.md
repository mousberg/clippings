# Google Cloud Run Deployment Guide

This guide explains how to deploy the PR Coverage Report Generator to Google Cloud Run using Google Container Registry (gcr.io).

## Prerequisites

1. **Google Cloud Project**: You need a GCP project with billing enabled
2. **APIs Enabled**: Enable the following APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```
3. **IAM Permissions**: Your account needs the following roles:
   - Cloud Build Editor
   - Cloud Run Admin
   - Storage Admin (for Container Registry)

## Quick Deployment

### Using Cloud Build (Recommended)

1. **Set your project ID**:
   ```bash
   export PROJECT_ID="your-gcp-project-id"
   gcloud config set project $PROJECT_ID
   ```

2. **Deploy using Cloud Build**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```
   
   This single command will:
   - Build the Docker image using Cloud Build
   - Push to Google Container Registry (gcr.io)
   - Deploy to Cloud Run automatically

3. **Set environment variables** (after deployment):
   ```bash
   gcloud run services update pr-coverage-gen \
     --region us-central1 \
     --set-env-vars GOOGLE_API_KEY="your-gemini-api-key"
   ```

### Alternative: Manual Docker Build (Not Recommended)

1. **Build and push the image**:
   ```bash
   export PROJECT_ID="your-gcp-project-id"
   
   # Build the image
   docker build -t gcr.io/$PROJECT_ID/pr-coverage-gen .
   
   # Push to Container Registry
   docker push gcr.io/$PROJECT_ID/pr-coverage-gen
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy pr-coverage-gen \
     --image gcr.io/$PROJECT_ID/pr-coverage-gen \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated \
     --port 8080 \
     --memory 1Gi \
     --cpu 1 \
     --set-env-vars GOOGLE_API_KEY="your-gemini-api-key"
   ```

## Configuration

### Environment Variables

The application supports the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini API key for RSS processing | Yes (for RSS features) |
| `PORT` | Port to run the application on | No (defaults to 8080) |

### Cloud Run Settings

The default configuration includes:
- **Memory**: 1GB
- **CPU**: 1 vCPU
- **Max instances**: 10
- **Timeout**: 300 seconds
- **Port**: 8080

## Customization

### Region

To deploy to a different region, modify the `_REGION` substitution in `cloudbuild.yaml`:

```yaml
substitutions:
  _REGION: 'europe-west1'  # Change to your preferred region
```

Or specify it during manual deployment:
```bash
gcloud run deploy pr-coverage-gen \
  --region europe-west1 \
  # ... other args
```

### Resource Limits

Modify the Cloud Run deployment args in `cloudbuild.yaml`:

```yaml
- '--memory'
- '2Gi'          # Increase memory
- '--cpu'
- '2'            # Increase CPU
```

### Authentication

To require authentication, remove `--allow-unauthenticated` from the deployment command.

## Monitoring

### Service URL

After deployment, get your service URL:
```bash
gcloud run services describe pr-coverage-gen \
  --region us-central1 \
  --format 'value(status.url)'
```

### Health Check

Test the deployment:
```bash
curl https://your-service-url/health
```

### Logs

View application logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=pr-coverage-gen" \
  --limit 50 \
  --format 'table(timestamp,textPayload)'
```

## API Usage

Once deployed, you can generate coverage reports for any topic:

### Generate Coverage Reports
```bash
# Harry Styles coverage report
curl -X POST "https://your-service-url/generate-report" \
  -H "Content-Type: application/json" \
  -d '{"subject": "Harry Styles", "max_articles": 15}' \
  --output harry-styles-coverage.pdf

# Technology coverage report
curl -X POST "https://your-service-url/generate-report" \
  -H "Content-Type: application/json" \
  -d '{"subject": "artificial intelligence", "max_articles": 25}' \
  --output ai-coverage.pdf

# Company coverage report
curl -X POST "https://your-service-url/generate-report" \
  -H "Content-Type: application/json" \
  -d '{"subject": "Tesla", "language": "en-GB", "country": "GB"}' \
  --output tesla-uk-coverage.pdf
```

## Troubleshooting

### Common Issues

1. **Build Timeout**: Increase timeout in `cloudbuild.yaml`
2. **Memory Issues**: Increase memory allocation in Cloud Run settings
3. **API Key Issues**: Ensure `GOOGLE_API_KEY` is set correctly
4. **Cold Starts**: Consider using minimum instances for better performance

### Debug Commands

```bash
# Check service status
gcloud run services describe pr-coverage-gen --region us-central1

# View recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit 20

# Check build history
gcloud builds list --limit=5

# View specific build logs
gcloud builds log BUILD_ID
```

## Cost Optimization

- **Minimum instances**: Set to 0 for cost savings (default)
- **CPU allocation**: Only during request processing (default)
- **Memory**: Start with 1GB and adjust based on usage
- **Timeout**: Reduce if your requests complete faster

For more information, see the [Cloud Run documentation](https://cloud.google.com/run/docs). 