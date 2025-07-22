# Cloud Run Compatibility Notes

## Issue: Read-Only Filesystem

Google Cloud Run containers have a **read-only filesystem**, which means applications cannot write files to disk. This caused errors when the RSS agent tried to write JSON and PDF files during report generation.

## Solution: In-Memory Functions

We've created **dual versions** of the report generation functions:

### 🗂️ **Disk-Based Functions (Local Development)**
- `create_report_from_topic()` - Writes JSON and PDF files to disk
- `create_report_from_rss()` - Writes JSON and PDF files to disk  
- `agent.save_json()` - Writes JSON files to disk

**Use for:** Local development, testing, when you need file outputs

### 💾 **In-Memory Functions (Cloud Run)**
- `create_report_from_topic_memory()` - Works entirely in memory
- Returns `(json_data_dict, pdf_bytes)` instead of file paths
- No filesystem writes - Cloud Run compatible

**Use for:** Production deployment, API endpoints, Cloud Run

## Code Changes Made

### 1. **New In-Memory Function**
```python
def create_report_from_topic_memory(topic: str, max_articles: int = 30, subject_override: str = None,
                                   google_api_key: str = None, language: str = "en-US", 
                                   country: str = "US") -> tuple[dict, bytes]:
    """In-memory function - Cloud Run compatible"""
    # Initialize agent
    agent = ArticleCategorizer(google_api_key)
    
    # Process topic to JSON (in memory)
    data = agent.process_topic_to_json(topic, max_articles, subject_override, language, country)
    
    # Generate PDF (in memory)  
    pdf_bytes = generate_report_pdf(subject=data["subject"], sections=data["sections"])
    
    return data, pdf_bytes  # Return data directly, no file I/O
```

### 2. **Updated API Endpoint**
```python
# Before (tried to write files)
json_path, pdf_path = create_report_from_topic(...)
with open(pdf_path, 'rb') as f:
    pdf_bytes = f.read()
os.remove(json_path)  # Cleanup
os.remove(pdf_path)

# After (works in memory)
json_data, pdf_bytes = create_report_from_topic_memory(...)
# Return pdf_bytes directly - no file I/O needed
```

### 3. **Enhanced Testing**
- **Local tests** use disk-based functions 
- **Cloud Run tests** use in-memory functions
- **API tests** verify the in-memory pipeline works end-to-end

## Migration Guide

### ✅ **For Cloud Run Deployment**
Use the in-memory functions:
```python
from rss_agent import create_report_from_topic_memory

# Generate report in memory
json_data, pdf_bytes = create_report_from_topic_memory(
    topic="artificial intelligence",
    max_articles=20
)

# Return PDF bytes directly (FastAPI)
return Response(content=pdf_bytes, media_type="application/pdf")
```

### 🗂️ **For Local Development**  
Use the disk-based functions:
```python
from rss_agent import create_report_from_topic

# Generate report files
json_path, pdf_path = create_report_from_topic(
    topic="artificial intelligence", 
    max_articles=20,
    output_json="my_data.json",
    output_pdf="my_report.pdf"
)
```

## Testing

### **Local Testing**
```bash
python test_rss_agent.py  # Tests both disk and memory functions
```

### **API Testing**  
```bash
# Terminal 1: Start server
python main.py

# Terminal 2: Test API
python test_api.py  # Tests the in-memory API endpoint
```

## Benefits

### 🚀 **Cloud Run Benefits**
- ✅ **No filesystem errors** - works on read-only containers
- ✅ **Faster performance** - no disk I/O overhead
- ✅ **Better security** - no temporary files created
- ✅ **Stateless design** - perfect for serverless

### 🛠️ **Local Development Benefits**
- ✅ **File outputs** - can inspect JSON and PDF files
- ✅ **Debugging** - easier to troubleshoot with saved files
- ✅ **Backward compatibility** - existing scripts still work

## Deployment

The main API (`main.py`) now uses the in-memory functions by default, making it fully compatible with Google Cloud Run and other containerized environments with read-only filesystems.

```bash
# Deploy to Cloud Run (now works!)
gcloud builds submit --config cloudbuild.yaml
``` 