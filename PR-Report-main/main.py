from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from datetime import datetime
import uvicorn

# Import RSS agent
from rss_agent import create_report_from_topic_memory

app = FastAPI(title="PR Coverage Report Generator", description="Generate PR coverage reports from any topic")

# Single request model
class ReportRequest(BaseModel):
    subject: str  # The topic to search for (e.g., "Harry Styles", "Apple Inc", "climate change")
    max_articles: int = 20
    filename: str = None
    google_api_key: str = None  # Optional, can use env var
    language: str = "en-US"  # Language code
    country: str = "US"  # Country code

@app.post("/generate-report")
async def generate_report(request: ReportRequest):
    """
    Generate a PR coverage report for any subject using AI-powered RSS analysis.
    
    Args:
        request: ReportRequest with subject and configuration
        
    Returns:
        PDF file as bytes with categorized news coverage
    """
    try:
        # Generate report from topic using RSS agent (in-memory for Cloud Run)
        json_data, pdf_bytes = create_report_from_topic_memory(
            topic=request.subject,
            max_articles=request.max_articles,
            subject_override=f"{request.subject} Coverage Report",
            google_api_key=request.google_api_key,
            language=request.language,
            country=request.country
        )
        
        # Generate filename
        filename = request.filename or f"{request.subject.replace(' ', '_')}-coverage-{datetime.now().strftime('%Y%m%d-%H%M%S')}.pdf"
        
        # Return the PDF as a response
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating coverage report: {str(e)}")

@app.get("/")
async def root():
    """
    Root endpoint with API information
    """
    return {
        "message": "PR Coverage Report Generator", 
        "description": "Generate AI-powered PR coverage reports for any topic",
        "endpoint": {
            "POST /generate-report": "Generate coverage report for any subject using AI analysis of news sources"
        },
        "example": {
            "subject": "Harry Styles",
            "max_articles": 20,
            "filename": "harry-styles-coverage.pdf",
            "language": "en-US",
            "country": "US"
        },
        "supported_topics": [
            "People: Harry Styles, Taylor Swift, Elon Musk",
            "Companies: Apple, Tesla, Microsoft, Netflix", 
            "Events: COP28, Olympics, World Cup",
            "Technology: artificial intelligence, blockchain, quantum computing",
            "Any topic covered by Google News"
        ],
        "features": [
            "AI-powered content categorization with Google Gemini",
            "Media tier classification (top-tier, mid-tier, low-tier sources)",
            "Coverage differentiation (headline vs mention)",
            "Professional PDF formatting with clickable links",
            "Multi-language and multi-region support"
        ]
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "pr_coverage_generator",
        "version": "1.0.0",
        "ai_engine": "google_gemini",
        "features": ["rss_processing", "ai_categorization", "media_tier_classification", "coverage_analysis"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 