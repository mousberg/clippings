#!/usr/bin/env python3
"""
Test script for RSS Agent - validates chunked processing and PDF generation
Run this to test the RSS agent functionality on localhost
"""

import os
import sys
import time
from pathlib import Path
import json

def test_environment():
    """Test that environment is set up correctly"""
    print("🔧 Testing Environment Setup")
    print("=" * 50)
    
    # Check Python version
    python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print(f"✓ Python version: {python_version}")
    
    # Check for Google API key
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("❌ GOOGLE_API_KEY environment variable not set")
        print("   Set it with: export GOOGLE_API_KEY='your-key-here'")
        print("   Get your key from: https://aistudio.google.com/app/apikey")
        return False
    else:
        print(f"✓ Google API key found (length: {len(api_key)})")
    
    # Check required modules
    required_modules = [
        'feedparser', 'langchain_google_genai', 'reportlab', 
        'fastapi', 'uvicorn', 'requests'
    ]
    
    missing_modules = []
    for module in required_modules:
        try:
            __import__(module)
            print(f"✓ {module} imported successfully")
        except ImportError:
            missing_modules.append(module)
            print(f"❌ {module} not found")
    
    if missing_modules:
        print(f"\n❌ Missing modules: {', '.join(missing_modules)}")
        print("   Install with: pip install -r requirements.txt")
        return False
    
    print("\n✅ Environment setup complete!")
    return True

def test_rss_agent_basic():
    """Test basic RSS agent functionality"""
    print("\n🤖 Testing RSS Agent - Basic Functionality")
    print("=" * 50)
    
    try:
        from rss_agent import ArticleCategorizer, build_google_news_rss_url
        
        # Test RSS URL building
        topic = "test topic"
        rss_url = build_google_news_rss_url(topic)
        print(f"✓ RSS URL generation works: {rss_url}")
        
        # Test agent initialization
        agent = ArticleCategorizer()
        print("✓ ArticleCategorizer initialized successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ RSS Agent basic test failed: {e}")
        return False

def test_rss_fetching():
    """Test RSS feed fetching"""
    print("\n📡 Testing RSS Feed Fetching")
    print("=" * 50)
    
    try:
        from rss_agent import ArticleCategorizer, build_google_news_rss_url
        
        agent = ArticleCategorizer()
        
        # Test with a simple topic
        topic = "technology"
        rss_url = build_google_news_rss_url(topic)
        print(f"Testing with topic: {topic}")
        print(f"RSS URL: {rss_url}")
        
        # Fetch articles
        articles = agent.fetch_rss_articles(rss_url, max_articles=5)
        
        if articles:
            print(f"✓ Successfully fetched {len(articles)} articles")
            print(f"  Sample article: {articles[0]['title'][:50]}...")
            return True
        else:
            print("❌ No articles fetched")
            return False
            
    except Exception as e:
        print(f"❌ RSS fetching test failed: {e}")
        return False

def test_chunked_categorization():
    """Test the chunked categorization feature"""
    print("\n🔄 Testing Chunked Article Categorization")
    print("=" * 50)
    
    try:
        from rss_agent import ArticleCategorizer
        
        agent = ArticleCategorizer()
        
        # Create sample articles for testing
        sample_articles = [
            {
                "title": "Apple Announces New iPhone Features",
                "link": "https://example.com/apple-news",
                "summary": "Apple introduces revolutionary features...",
                "source": "reuters.com"
            },
            {
                "title": "Tech Startup Raises $50M in Funding",
                "link": "https://example.com/startup-news", 
                "summary": "A promising startup receives major funding...",
                "source": "techcrunch.com"
            },
            {
                "title": "AI Breakthrough in Medical Research",
                "link": "https://example.com/ai-news",
                "summary": "Researchers achieve breakthrough using AI...",
                "source": "nature.com"
            }
        ]
        
        print(f"Testing categorization with {len(sample_articles)} sample articles")
        
        # Test categorization
        result = agent.categorize_articles(sample_articles, "Technology News Test")
        
        if result and "sections" in result:
            print(f"✓ Categorization successful!")
            print(f"  Subject: {result['subject']}")
            print(f"  Sections created: {len(result['sections'])}")
            
            for i, section in enumerate(result['sections'], 1):
                print(f"    {i}. {section['heading']}: {len(section['items'])} articles")
            
            return True
        else:
            print("❌ Categorization failed - no sections created")
            return False
            
    except Exception as e:
        print(f"❌ Chunked categorization test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_full_pipeline():
    """Test the complete pipeline from topic to PDF"""
    print("\n📄 Testing Complete Pipeline (Topic → RSS → JSON → PDF)")
    print("=" * 50)
    
    try:
        from rss_agent import create_report_from_topic
        
        topic = "artificial intelligence"
        print(f"Testing complete pipeline with topic: '{topic}'")
        print("This will take a few moments...")
        
        start_time = time.time()
        
        # Generate report
        json_path, pdf_path = create_report_from_topic(
            topic=topic,
            max_articles=6,  # Small number for faster testing
            subject_override=f"{topic} Test Report",
            output_json="test_output.json",
            output_pdf="test_report.pdf"
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Validate outputs
        json_file = Path(json_path)
        pdf_file = Path(pdf_path)
        
        if json_file.exists() and pdf_file.exists():
            json_size = json_file.stat().st_size
            pdf_size = pdf_file.stat().st_size
            
            print(f"✅ Complete pipeline test successful!")
            print(f"  Processing time: {processing_time:.2f} seconds")
            print(f"  JSON file: {json_path} ({json_size} bytes)")
            print(f"  PDF file: {pdf_path} ({pdf_size} bytes)")
            
            # Show JSON structure
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"  JSON sections: {len(data.get('sections', []))}")
                total_articles = sum(len(section.get('items', [])) for section in data.get('sections', []))
                print(f"  Total articles processed: {total_articles}")
            
            return True
        else:
            print("❌ Pipeline test failed - output files not created")
            return False
            
    except Exception as e:
        print(f"❌ Full pipeline test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_memory_pipeline():
    """Test the in-memory pipeline (Cloud Run compatible)"""
    print("\n💾 Testing In-Memory Pipeline (Cloud Run Compatible)")
    print("=" * 50)
    
    try:
        from rss_agent import create_report_from_topic_memory
        
        topic = "space exploration"
        print(f"Testing in-memory pipeline with topic: '{topic}'")
        print("This will take a few moments...")
        
        start_time = time.time()
        
        # Generate report in memory
        json_data, pdf_bytes = create_report_from_topic_memory(
            topic=topic,
            max_articles=6,  # Small number for faster testing
            subject_override=f"{topic} Memory Test Report"
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Validate outputs
        if json_data and pdf_bytes:
            pdf_size = len(pdf_bytes)
            sections_count = len(json_data.get('sections', []))
            total_articles = sum(len(section.get('items', [])) for section in json_data.get('sections', []))
            
            print(f"✅ In-memory pipeline test successful!")
            print(f"  Processing time: {processing_time:.2f} seconds")
            print(f"  JSON data: {sections_count} sections")
            print(f"  PDF bytes: {pdf_size} bytes")
            print(f"  Total articles processed: {total_articles}")
            print(f"  Subject: {json_data.get('subject', 'N/A')}")
            
            # Save a test file to verify PDF content
            test_pdf_path = "test_memory_report.pdf"
            with open(test_pdf_path, 'wb') as f:
                f.write(pdf_bytes)
            print(f"  Test PDF saved: {test_pdf_path}")
            
            return True
        else:
            print("❌ Memory pipeline test failed - no data returned")
            return False
            
    except Exception as e:
        print(f"❌ Memory pipeline test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_server():
    """Test the FastAPI server"""
    print("\n🌐 Testing FastAPI Server")
    print("=" * 50)
    
    try:
        import subprocess
        import requests
        import threading
        import time
        
        print("Starting FastAPI server in background...")
        
        # Start server in background
        server_process = subprocess.Popen([
            sys.executable, "main.py"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for server to start
        time.sleep(3)
        
        try:
            # Test health endpoint
            response = requests.get("http://localhost:8000/health", timeout=5)
            if response.status_code == 200:
                print("✓ Health endpoint working")
                
                # Test API documentation
                docs_response = requests.get("http://localhost:8000/docs", timeout=5)
                if docs_response.status_code == 200:
                    print("✓ API documentation accessible at http://localhost:8000/docs")
                
                print("✅ FastAPI server test successful!")
                print("  Server is running at: http://localhost:8000")
                print("  Interactive docs: http://localhost:8000/docs")
                
                server_process.terminate()
                return True
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
                server_process.terminate()
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Could not connect to server: {e}")
            server_process.terminate()
            return False
            
    except Exception as e:
        print(f"❌ API server test failed: {e}")
        return False

def cleanup_test_files():
    """Clean up test files"""
    print("\n🧹 Cleaning up test files...")
    
    test_files = [
        "test_output.json",
        "test_report.pdf",
        "test_memory_report.pdf",
        "sample_rss_data.json", 
        "sample_report.pdf"
    ]
    
    cleaned = 0
    for file_path in test_files:
        if Path(file_path).exists():
            try:
                Path(file_path).unlink()
                print(f"  ✓ Removed {file_path}")
                cleaned += 1
            except Exception as e:
                print(f"  ❌ Could not remove {file_path}: {e}")
    
    if cleaned > 0:
        print(f"✓ Cleaned up {cleaned} test files")
    else:
        print("✓ No test files to clean up")

def main():
    """Run all tests"""
    print("🚀 RSS Agent Test Suite")
    print("=" * 50)
    print("This will test the RSS agent functionality and PDF generation")
    print("Make sure you have set GOOGLE_API_KEY environment variable\n")
    
    test_results = []
    
    # Run tests
    tests = [
        ("Environment Setup", test_environment),
        ("RSS Agent Basic", test_rss_agent_basic),
        ("RSS Feed Fetching", test_rss_fetching),
        ("Chunked Categorization", test_chunked_categorization),
        ("Full Pipeline", test_full_pipeline),
        ("Memory Pipeline (Cloud Run)", test_memory_pipeline),
        ("API Server", test_api_server)
    ]
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            test_results.append((test_name, result))
        except KeyboardInterrupt:
            print("\n\n❌ Tests interrupted by user")
            break
        except Exception as e:
            print(f"❌ {test_name} failed with unexpected error: {e}")
            test_results.append((test_name, False))
    
    # Clean up
    cleanup_test_files()
    
    # Summary
    print(f"\n{'='*50}")
    print("🏁 TEST SUMMARY")
    print(f"{'='*50}")
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! RSS Agent is working correctly.")
        print("\nNext steps:")
        print("1. Start the server: python main.py")
        print("2. Open browser: http://localhost:8000/docs")
        print("3. Test API endpoint: POST /generate-report")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 