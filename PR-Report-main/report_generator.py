import json
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.colors import blue, black
from io import BytesIO
from typing import List, Dict


def create_link_paragraph(title: str, url: str, styles, source: str = None, tier: str = None, coverage_type: str = None):
    """Create a paragraph with title text, clickable link, and metadata"""
    # Create the content with the title text and link
    link_style = ParagraphStyle(
        'LinkStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=black,  # Keep title text black
        leftIndent=0,
        spaceBefore=6,
        spaceAfter=6
    )
    
    # Format: Title text (black) followed by clickable link (blue)
    content = f'<font color="black">{title}</font> <a href="{url}" color="blue">{url}</a>'
    
    # Add metadata if available
    metadata_parts = []
    if source:
        metadata_parts.append(f"Source: {source}")
    if tier:
        tier_display = tier.replace("-", " ").title()
        metadata_parts.append(f"Tier: {tier_display}")
    if coverage_type:
        coverage_display = coverage_type.replace("_", " ").title()
        metadata_parts.append(f"Coverage: {coverage_display}")
    
    if metadata_parts:
        metadata_text = f'<font size="8" color="gray"><br/>({" | ".join(metadata_parts)})</font>'
        content += metadata_text
    
    return Paragraph(content, link_style)


def generate_report_pdf(subject: str, items: List[Dict[str, str]] = None, sections: List[Dict] = None, filename: str = None) -> bytes:
    """
    Generate a PDF report in the same format as example1.pdf
    
    Args:
        subject: The subject/title of the report
        items: List of dictionaries with 'title' and 'link' keys (for backward compatibility)
        sections: List of sections with headings and items (new format)
        filename: Optional filename for the PDF
        
    Returns:
        PDF file as bytes
    """
    # Create a BytesIO buffer to hold the PDF
    buffer = BytesIO()
    
    # Set up the document
    if not filename:
        filename = f"report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.pdf"
    
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Create custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=16,
        spaceAfter=30,
        textColor=black,
        alignment=1  # Center alignment
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading1'],
        fontSize=14,
        spaceBefore=20,
        spaceAfter=12,
        textColor=black,
        leftIndent=0
    )
    
    # Story to hold all content
    story = []
    
    # Add the subject as title
    title = Paragraph(subject, title_style)
    story.append(title)
    story.append(Spacer(1, 20))
    
    # Handle both old format (items) and new format (sections)
    if sections:
        # New format with sections and subheadings
        for section in sections:
            # Add section heading
            if 'heading' in section:
                heading = Paragraph(section['heading'], heading_style)
                story.append(heading)
            
            # Add items in this section
            if 'items' in section:
                for item in section['items']:
                    # Extract metadata if available
                    source = item.get('source')
                    tier = item.get('tier')
                    coverage_type = item.get('coverage_type')
                    
                    link_para = create_link_paragraph(
                        item['title'], 
                        item['link'], 
                        styles,
                        source=source,
                        tier=tier,
                        coverage_type=coverage_type
                    )
                    story.append(link_para)
                    story.append(Spacer(1, 8))
            
            # Add extra space after each section
            story.append(Spacer(1, 12))
    
    elif items:
        # Backward compatibility: old format with just items
        for item in items:
            # Extract metadata if available (for backward compatibility)
            source = item.get('source')
            tier = item.get('tier')
            coverage_type = item.get('coverage_type')
            
            link_para = create_link_paragraph(
                item['title'], 
                item['link'], 
                styles,
                source=source,
                tier=tier,
                coverage_type=coverage_type
            )
            story.append(link_para)
            story.append(Spacer(1, 8))
    
    else:
        raise ValueError("Either 'items' or 'sections' must be provided")
    
    # Build the PDF
    doc.build(story)
    
    # Get the PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes


def create_report_from_json_file(json_file_path: str, output_path: str = None):
    """
    Create a report PDF from a JSON file.
    
    Args:
        json_file_path: Path to JSON file containing report data
        output_path: Optional output path for the PDF file
    """
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        
        # Support both old format (items) and new format (sections)
        if "sections" in data:
            pdf_bytes = generate_report_pdf(
                subject=data["subject"],
                sections=data["sections"],
                filename=data.get("filename")
            )
        elif "items" in data:
            # Backward compatibility
            pdf_bytes = generate_report_pdf(
                subject=data["subject"],
                items=data["items"],
                filename=data.get("filename")
            )
        else:
            raise ValueError("JSON must contain either 'sections' or 'items' field")
        
        if not output_path:
            output_path = f"report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.pdf"
        
        with open(output_path, 'wb') as f:
            f.write(pdf_bytes)
        
        print(f"Report generated successfully: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        return None


if __name__ == "__main__":
    # Example usage when run directly - generate report from RSS feed
    import os
    
    print("🤖 RSS-Powered Sample Report Generator")
    print("=" * 45)
    
    # Check for Google API key
    if not os.getenv("GOOGLE_API_KEY"):
        print("❌ GOOGLE_API_KEY environment variable not set")
        print("   Get your API key from: https://aistudio.google.com/app/apikey")
        print("   Then run: export GOOGLE_API_KEY='your-key-here'")
        print("\n🔄 Falling back to static JSON example...")
        
        # Fallback to JSON file approach
        json_file = "example_report_data.json"
        output_file = "sample_report.pdf"
        
        try:
            result = create_report_from_json_file(json_file, output_file)
            if result:
                print(f"✓ Sample report generated from JSON: {result}")
            else:
                print("✗ Failed to generate sample report")
        except FileNotFoundError:
            print(f"✗ JSON file not found: {json_file}")
            print("Please ensure example_report_data.json exists in the current directory")
        except Exception as e:
            print(f"✗ Error generating sample report: {e}")
    else:
        # Use RSS agent to generate sample report
        try:
            from rss_agent import create_report_from_topic, build_google_news_rss_url
            
            topic = "Elon Musk"
            print(f"📡 Fetching articles for topic: {topic}")
            print(f"🔗 RSS URL: {build_google_news_rss_url(topic)}")
            print("🔄 Processing with Gemini AI categorization...")
            
            # Generate report from topic
            json_path, pdf_path = create_report_from_topic(
                topic=topic,
                max_articles=15,
                subject_override=f"{topic} News Summary",
                output_json="sample_rss_data.json",
                output_pdf="sample_report.pdf"
            )
            
            print(f"✅ RSS-powered sample report generated successfully!")
            print(f"📄 JSON data: {json_path}")
            print(f"📄 PDF report: {pdf_path}")
            
        except ImportError as e:
            print(f"❌ Import error: {e}")
            print("Please ensure all dependencies are installed: pip install -r requirements.txt")