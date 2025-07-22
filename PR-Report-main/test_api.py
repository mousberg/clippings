#!/usr/bin/env python3
"""
Simple API test script - tests the FastAPI endpoint directly
Run this with the server running to test API functionality
"""

import requests
import json
import time
from pathlib import Path

def test_api_endpoint():
    """Test the /generate-report endpoint"""
    print("🌐 Testing API Endpoint")
    print("=" * 40)
    
    # API endpoint
    url = "http://localhost:8000/generate-report"
    
    # Test request data
    request_data = {
        "subject": "artificial intelligence",
        "max_articles": 8,
        "filename": "ai-test-report.pdf",
        "language": "en-US",
        "country": "US"
    }
    
    print(f"Making request to: {url}")
    print(f"Request data: {json.dumps(request_data, indent=2)}")
    print("\nSending request... (this may take 30-60 seconds)")
    
    try:
        start_time = time.time()
        
        # Make the request
        response = requests.post(
            url,
            json=request_data,
            timeout=120  # 2 minute timeout
        )
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        print(f"\nResponse received in {processing_time:.2f} seconds")
        print(f"Status code: {response.status_code}")
        print(f"Content type: {response.headers.get('content-type', 'unknown')}")
        print(f"Content length: {len(response.content)} bytes")
        
        if response.status_code == 200:
            # Check if it's a PDF
            if response.headers.get('content-type') == 'application/pdf':
                # Save the PDF
                output_file = "api_test_report.pdf"
                with open(output_file, 'wb') as f:
                    f.write(response.content)
                
                print(f"✅ API test successful!")
                print(f"  📄 PDF saved as: {output_file}")
                print(f"  📊 File size: {len(response.content)} bytes")
                
                # Check if file exists and has content
                if Path(output_file).exists() and Path(output_file).stat().st_size > 1000:
                    print(f"  ✓ PDF file created successfully and has content")
                    return True
                else:
                    print(f"  ❌ PDF file is too small or empty")
                    return False
            else:
                print(f"❌ Response is not a PDF: {response.headers.get('content-type')}")
                print(f"Response content: {response.text[:200]}...")
                return False
        else:
            print(f"❌ API request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out (took longer than 2 minutes)")
        return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the server")
        print("   Make sure the server is running with: python main.py")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def test_health_endpoint():
    """Test the health endpoint"""
    print("\n❤️  Testing Health Endpoint")
    print("=" * 40)
    
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        
        if response.status_code == 200:
            print("✅ Health endpoint working")
            try:
                health_data = response.json()
                print(f"   Status: {health_data.get('status', 'unknown')}")
            except:
                print(f"   Response: {response.text}")
            return True
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to health endpoint")
        print("   Make sure the server is running with: python main.py")
        return False
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")
        return False

def test_docs_endpoint():
    """Test the documentation endpoint"""
    print("\n📚 Testing Documentation Endpoint")
    print("=" * 40)
    
    try:
        response = requests.get("http://localhost:8000/docs", timeout=5)
        
        if response.status_code == 200:
            print("✅ Documentation endpoint working")
            print("   Available at: http://localhost:8000/docs")
            return True
        else:
            print(f"❌ Documentation endpoint failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to documentation endpoint")
        return False
    except Exception as e:
        print(f"❌ Documentation endpoint test failed: {e}")
        return False

def main():
    """Run API tests"""
    print("🚀 API Test Suite")
    print("=" * 50)
    print("This script tests the FastAPI server endpoints")
    print("Make sure the server is running: python main.py\n")
    
    tests = [
        ("Health Endpoint", test_health_endpoint),
        ("Documentation Endpoint", test_docs_endpoint),
        ("Generate Report Endpoint", test_api_endpoint)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*15} {test_name} {'='*15}")
        try:
            result = test_func()
            results.append((test_name, result))
        except KeyboardInterrupt:
            print("\n❌ Tests interrupted by user")
            break
        except Exception as e:
            print(f"❌ {test_name} failed: {e}")
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*50}")
    print("🏁 API TEST SUMMARY")
    print(f"{'='*50}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All API tests passed!")
        print("\n✅ Your RSS Agent API is working correctly!")
        print("\nNext steps:")
        print("1. Open browser: http://localhost:8000/docs")
        print("2. Try different topics in the API")
        print("3. Test with larger max_articles values")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        print("\nTroubleshooting:")
        print("1. Make sure server is running: python main.py")
        print("2. Check GOOGLE_API_KEY is set")
        print("3. Verify internet connection")
    
    # Clean up test file
    test_file = Path("api_test_report.pdf")
    if test_file.exists():
        try:
            test_file.unlink()
            print(f"\n🧹 Cleaned up test file: api_test_report.pdf")
        except:
            pass

if __name__ == "__main__":
    main() 