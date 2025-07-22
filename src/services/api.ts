import { DailyReport } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pr-coverage-gen-534113739138.europe-west1.run.app';

export interface GenerateReportRequest {
  subject: string;
  max_articles?: number;
  filename?: string;
  language?: string;
  country?: string;
}

export interface ExportPDFRequest {
  clientName: string;
  date: string;
  articles: Array<{
    id: number;
    title: string;
    outlet: string;
    tier: string;
    focusType: string;
    summary: string;
  }>;
  includeInternational: boolean;
}

export interface SendEmailRequest {
  clientName: string;
  pdfUrl: string;
  recipientEmail?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async generateReport(clientName: string, includeInternational: boolean = false): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: clientName,
        max_articles: includeInternational ? 20 : 15,
        filename: `${clientName.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}.pdf`,
        language: 'en-US',
        country: includeInternational ? 'US' : 'GB',
        // Note: Backend developer needs to set GOOGLE_API_KEY environment variable
        // or we need to pass google_api_key parameter here
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  static async exportPDF(request: ExportPDFRequest): Promise<{ downloadUrl: string; filename: string }> {
    return this.request<{ downloadUrl: string; filename: string }>('/reports/export/pdf', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async sendEmail(request: SendEmailRequest): Promise<{ success: boolean; emailId: string }> {
    return this.request<{ success: boolean; emailId: string }>('/reports/send-email', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Helper method to search for client suggestions (optional)
  static async searchClients(query: string): Promise<string[]> {
    if (query.length < 2) return [];
    
    try {
      return this.request<{ suggestions: string[] }>(`/clients/search?q=${encodeURIComponent(query)}`)
        .then(response => response.suggestions);
    } catch {
      // Fallback to some popular clients if API not available
      const popularClients = [
        'Beyoncé', 'Harry Styles', 'Taylor Swift', 'Netflix', 'Apple',
        'Tesla', 'Microsoft', 'Google', 'Amazon', 'Meta'
      ];
      return popularClients.filter(client => 
        client.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
}

// Fallback function for development/demo when API isn't ready
export async function generateMockReportFallback(
  clientName: string, 
  includeInternational: boolean = false
): Promise<DailyReport> {
  // This will be removed once real API is ready
  
  // Generate realistic mock data for any client
  const outlets = includeInternational 
    ? ["BBC", "The Guardian", "The Times", "Sky News", "CNN", "Reuters", "AP", "Bloomberg", "Wall Street Journal"] 
    : ["BBC", "The Guardian", "The Times", "Sky News", "Independent"];
  
  const articleCount = includeInternational ? Math.floor(Math.random() * 15) + 8 : Math.floor(Math.random() * 10) + 5;
  
  const sampleArticles = Array.from({ length: articleCount }, (_, i) => ({
    id: i + 1000 + Math.floor(Math.random() * 1000),
    title: `${clientName} ${["Makes Headlines", "In the News", "Featured Story", "Breaking News", "Global Coverage", "International Spotlight", "Media Buzz", "Industry Focus"][i % 8]}`,
    url: `https://example.com/article${i}`,
    outlet: outlets[i % outlets.length],
    tier: (["Top", "Mid", "Blog"] as const)[Math.floor(Math.random() * 3)],
    focusType: (["Headline", "Mention"] as const)[Math.floor(Math.random() * 2)],
    estViews: Math.floor(Math.random() * 100000) + 1000,
    publishedAt: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
    sentiment: (["positive", "neutral", "negative"] as const)[Math.floor(Math.random() * 3)],
    summary: `${includeInternational ? 'International' : 'UK'} coverage featuring ${clientName} in ${outlets[i % outlets.length]}.`,
    includedInReport: Math.random() > 0.2, // Most articles included by default
    screenshot: `/screenshots/article-${i}.png`
  }));
  
  const topCount = sampleArticles.filter(a => a.tier === "Top").length;
  const midCount = sampleArticles.filter(a => a.tier === "Mid").length;
  const blogCount = sampleArticles.filter(a => a.tier === "Blog").length;
  
  return {
    clientId: clientName.toLowerCase().replace(/\s+/g, '-'),
    clientName: clientName,
    date: new Date().toISOString().split('T')[0],
    articles: sampleArticles,
    summary: {
      topTierCount: topCount,
      midTierCount: midCount,
      blogCount: blogCount,
      totalMentions: sampleArticles.length,
      sentimentBreakdown: {
        positive: sampleArticles.filter(a => a.sentiment === "positive").length,
        neutral: sampleArticles.filter(a => a.sentiment === "neutral").length,
        negative: sampleArticles.filter(a => a.sentiment === "negative").length,
      },
    },
    generatedAt: new Date().toISOString(),
  };
}