#!/usr/bin/env python3
"""
Example script demonstrating RSS Agent usage for automatic report generation
"""

import os
from rss_agent import create_report_from_topic, ArticleCategorizer, build_google_news_rss_url


def main():
    """Main example function"""
    
    # Check for Google API key
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ Please set GOOGLE_API_KEY environment variable")
        print("   You can get an API key from: https://aistudio.google.com/app/apikey")
        print("   Then run: export GOOGLE_API_KEY='your-key-here'")
        return
    
    print("🤖 RSS Agent Demo")
    print("=" * 50)
    
    # Use Harry Styles as example topic
    topic = "Harry Styles"
    feed_name = f"{topic} Google News"
    rss_url = build_google_news_rss_url(topic)
    
    print(f"\n📡 Processing: {feed_name}")
    print(f"   URL: {rss_url}")
    print(f"   Max articles: 15")
    
    try:
        # Method 1: Complete pipeline (Topic -> RSS -> JSON -> PDF)
        print("\n🔄 Method 1: Complete pipeline (Topic -> RSS -> JSON -> PDF)")
        json_path, pdf_path = create_report_from_topic(
            topic=topic,
            max_articles=15,
            subject_override=f"{topic} Daily Summary",
            output_json="example_rss_output.json",
            output_pdf="example_rss_report.pdf"
        )
        
        print(f"✅ Complete!")
        print(f"   📄 JSON: {json_path}")
        print(f"   📄 PDF: {pdf_path}")
        
        # Method 2: Just process topic to JSON (for inspection)
        print("\n🔄 Method 2: Topic to JSON only")
        agent = ArticleCategorizer()
        data = agent.process_topic_to_json(
            topic=topic,
            max_articles=10,
            subject_override=f"{topic} Headlines"
        )
        
        print(f"✅ Processed {len(data.get('sections', []))} sections:")
        for section in data.get('sections', []):
            print(f"   📰 {section['heading']}: {len(section['items'])} articles")
        
        # Save JSON for inspection
        agent.save_json(data, "example_headlines_only.json")
        print(f"   📄 JSON saved: example_headlines_only.json")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Check your Google API key")
        print("2. Ensure you have internet connection")
        print("3. Try a different RSS feed if one is down")
        print("4. Check the RSS URL is valid")


def test_multiple_feeds():
    """Test processing multiple RSS feeds"""
    
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ GOOGLE_API_KEY not set")
        return
    
    topics = [
        "Harry Styles",
        "artificial intelligence",
        "climate change"
    ]
    
    print("🔄 Testing multiple topics...")
    
    for topic in topics:
        try:
            print(f"\nProcessing topic: {topic}...")
            agent = ArticleCategorizer()
            data = agent.process_topic_to_json(topic, max_articles=5)
            
            print(f"✅ {topic}: {len(data['sections'])} sections")
            
        except Exception as e:
            print(f"❌ {topic} failed: {e}")


if __name__ == "__main__":
    print("Choose an option:")
    print("1. Run main demo")
    print("2. Test multiple feeds")
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "2":
        test_multiple_feeds()
    else:
        main() 