<div align="center">

<img src="public/clippings-logo.svg" width="300" alt="Clippings Logo">

# Clippings
**AI-Powered Media Coverage Reports**

Real-time PR coverage analysis using Google News RSS feeds and Google Gemini AI

[Live Demo](https://getclippings.co)

</div>

---

## 🎥 Demo

https://github.com/user-attachments/assets/9babd68c-4985-4e09-997f-24d80895e3cf


---

## 🚀 What It Does

Clippings generates professional media coverage reports for any person, brand, or topic:

- **Real-time Google News scraping** for comprehensive coverage
- **AI categorization** with Google Gemini (Top/Mid/Blog tier outlets)  
- **Sentiment analysis** across all coverage
- **Professional PDF reports** with clickable links
- **8-12 second generation** from search to download

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Google News RSS, Google Gemini AI, ReportLab
- **Deployment**: Vercel (frontend) + Google Cloud Run (backend)
- **UI Components**: Radix UI, Lucide Icons

## 🏃‍♂️ Quick Start

```bash
# Clone repository
git clone https://github.com/mousberg/clippings.git
cd clippings

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build
```

Open [http://localhost:3000](http://localhost:3000) and search for any celebrity, brand, or topic.

## 📡 API Integration

The frontend connects to a Google Cloud Run backend at:
```
https://pr-coverage-gen-534113739138.europe-west1.run.app
```

**Example API call:**
```javascript
fetch('/generate-report', {
  method: 'POST',
  body: JSON.stringify({
    subject: "Harry Styles",
    max_articles: 15,
    language: "en-US", 
    country: "GB"
  })
})
```

Returns a PDF with real Google News data, AI-categorized by media tier.

---

<div align="center">

**Built with ❤️ for PR professionals**

*Powered by Google Gemini AI*

</div>