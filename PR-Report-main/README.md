# PR Coverage Report Generator

A FastAPI service that generates AI-powered PR coverage reports for any topic using Google News RSS feeds.

## Components

1. **Main API** (`main.py`) - Single endpoint API server
2. **Report Generator** (`report_generator.py`) - Core logic for structured PDF reports with links
3. **RSS Agent** (`rss_agent.py`) - LangChain-powered agent with Google Gemini for RSS processing and AI categorization

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Cloud Deployment

Deploy to Google Cloud Run using Cloud Build:

```bash
# Quick deployment
./deploy.sh

# Or manually
gcloud builds submit --config cloudbuild.yaml
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

2. Set up your Google API key (required for RSS agent):
```bash
export GOOGLE_API_KEY="your-google-api-key-here"
```
Get your API key from: https://aistudio.google.com/app/apikey
Or pass it directly in API requests.

## Usage

1. Start the API server:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. The API will be available at `http://localhost:8000`

## API Endpoint

### POST /generate-report

Generates an AI-powered PR coverage report for any subject by automatically fetching and categorizing news articles.

**Request Body:**
```json
{
    "subject": "Harry Styles",
    "max_articles": 20,
    "filename": "harry-styles-coverage.pdf",
    "language": "en-US",
    "country": "US"
}
```

**Response:** PDF file (application/pdf) with categorized news coverage

**Example using curl:**
```bash
# Generate Harry Styles coverage report
curl -X POST "http://localhost:8000/generate-report" \
     -H "Content-Type: application/json" \
     -d '{"subject": "Harry Styles", "max_articles": 15}' \
     --output harry-styles-coverage.pdf

# Generate AI technology coverage report
curl -X POST "http://localhost:8000/generate-report" \
     -H "Content-Type: application/json" \
     -d '{"subject": "artificial intelligence", "max_articles": 25}' \
     --output ai-coverage.pdf

# Generate Apple Inc coverage report for UK market
curl -X POST "http://localhost:8000/generate-report" \
     -H "Content-Type: application/json" \
     -d '{"subject": "Apple Inc", "language": "en-GB", "country": "GB"}' \
     --output apple-uk-coverage.pdf
```

**Example using Python requests:**
```python
import requests

# Generate Harry Styles coverage report
response = requests.post(
    "http://localhost:8000/generate-report",
    json={
        "subject": "Harry Styles",
        "max_articles": 20,
        "filename": "harry-styles-coverage.pdf"
    }
)

if response.status_code == 200:
    with open("harry-styles-coverage.pdf", "wb") as f:
        f.write(response.content)
    print("Coverage report generated successfully!")

# Generate tech company coverage report
response = requests.post(
    "http://localhost:8000/generate-report",
    json={
        "subject": "Tesla",
        "max_articles": 15,
        "language": "en-US",
        "country": "US"
    }
)

if response.status_code == 200:
    with open("tesla-coverage.pdf", "wb") as f:
        f.write(response.content)
    print("Tesla coverage report generated!")

# Generate international coverage report
response = requests.post(
    "http://localhost:8000/generate-report",
    json={
        "subject": "climate change",
        "max_articles": 30,
        "language": "en-GB",
        "country": "GB"
    }
)

if response.status_code == 200:
    with open("climate-coverage-uk.pdf", "wb") as f:
        f.write(response.content)
    print("Climate change coverage report generated!")
```

### Using Direct Functions

**Generate coverage reports:**
```python
from rss_agent import create_report_from_topic

# Generate Harry Styles coverage report
json_path, pdf_path = create_report_from_topic(
    topic="Harry Styles",
    max_articles=15,
    subject_override="Harry Styles Coverage Report"
)
print(f"Generated: {pdf_path}")

# Generate technology coverage report
json_path, pdf_path = create_report_from_topic(
    topic="artificial intelligence",
    max_articles=25,
    subject_override="AI Technology Coverage"
)
print(f"Generated: {pdf_path}")
```

**Process topics to JSON only:**
```python
from rss_agent import ArticleCategorizer

# Process any topic to categorized JSON
agent = ArticleCategorizer()
data = agent.process_topic_to_json(
    topic="space exploration",
    max_articles=10
)
print(f"Categorized into {len(data['sections'])} sections")
```

### Additional Endpoints

#### GET /

Returns API information and supported topics.

#### GET /health

Health check endpoint showing service status.

## Interactive Documentation

When the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

### AI-Powered Coverage Analysis
- **Automatic topic processing** - Enter any subject and get comprehensive coverage
- **Google News integration** - Fetches latest articles from Google News RSS
- **Smart categorization** using Google Gemini 2.0 Flash AI
- **Media tier classification** - Distinguishes top-tier, mid-tier, and low-tier sources
- **Coverage differentiation** - Identifies headline coverage vs mentions
- **Multi-language support** - Generate reports in different languages/regions

### Professional PDF Output
- **Structured sections** with clear headings and subheadings
- **Clickable links** to original articles (blue links in PDF)
- **Source attribution** with media tier and coverage type metadata
- **Professional formatting** with proper spacing and typography
- **Custom filenames** and automatic timestamping

### System Architecture
- **Single endpoint design** - One simple route for all coverage reports
- **Dynamic RSS URL generation** - Builds Google News RSS URLs for any topic
- **AI-powered processing** using LangChain + Google Gemini 2.0 Flash
- **Modular components** - Separate RSS agent and report generator modules
- **Cloud-ready** with Docker and Google Cloud Run deployment
- **Environment variable configuration** for API keys and settings

## Technical Features
- **FastAPI framework** with automatic validation and documentation
- **Comprehensive error handling** with detailed error messages
- **Automatic cleanup** of temporary files
- **Health check endpoint** for monitoring
- **Interactive API documentation** at `/docs`
- **Multi-region support** with language and country parameters

## Example Usage

### Quick Start with RSS

1. **Set your Google API key:**
   ```bash
   export GOOGLE_API_KEY="your-key-here"
   ```

2. **Run the example:**
   ```bash
   python example_rss_usage.py
   ```

3. **Or use the API:**
   ```bash
   curl -X POST "http://localhost:8000/generate-report" \
        -H "Content-Type: application/json" \
        -d '{"subject": "Harry Styles", "max_articles": 15}' \
        --output harry-styles-coverage.pdf
   ```

### Supported Topics

The service can generate coverage reports for any topic that appears in Google News:

**People & Celebrities:**
- `Harry Styles`, `Taylor Swift`, `Elon Musk`, `Joe Biden`

**Companies & Brands:**
- `Apple`, `Tesla`, `Microsoft`, `Netflix`, `Google`

**Technology:**
- `artificial intelligence`, `blockchain`, `quantum computing`, `ChatGPT`

**Events & Trends:**
- `COP28`, `Olympics 2024`, `World Cup`, `climate change`

**Geographic Topics:**
- `London news`, `California wildfires`, `Japan earthquake`

**Industries:**
- `renewable energy`, `electric vehicles`, `space exploration`
