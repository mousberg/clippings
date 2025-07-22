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
    try {
      console.log(`Calling backend API at: ${API_BASE_URL}/generate-report`);
      console.log('Request payload:', {
        subject: clientName,
        max_articles: includeInternational ? 20 : 15,
        language: 'en-US',
        country: includeInternational ? 'US' : 'GB',
      });

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
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('PDF blob size:', blob.size, 'bytes');
      return blob;
    } catch (error) {
      console.error('Full error details:', error);
      if (error instanceof TypeError && error.message === 'Load failed') {
        throw new Error('Network error: Cannot connect to backend. This is likely a CORS issue.');
      }
      throw error;
    }
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
  
  // Special case for Andy Byron - all negative Coldplay scandal coverage
  if (clientName.toLowerCase().includes('andy byron')) {
    const scandalArticles = [
      {
        id: 1001,
        title: "Andy Byron: US tech CEO resigns after Coldplay concert embrace goes viral",
        url: "https://bbc.co.uk/news/andy-byron-resigns",
        outlet: "BBC",
        tier: "Top" as const,
        focusType: "Headline" as const,
        estViews: 250000,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Astronomer CEO resigns after being caught on kiss cam with HR head at Coldplay concert while married.",
        includedInReport: true,
        screenshot: "/screenshots/bbc-scandal.png"
      },
      {
        id: 1002,
        title: "Astronomer CEO resigns after viral incident at Coldplay concert",
        url: "https://cnn.com/tech/andy-byron-scandal",
        outlet: "CNN",
        tier: "Top" as const,
        focusType: "Headline" as const,
        estViews: 180000,
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Tech executive forced to step down after compromising video surfaces from concert kiss cam.",
        includedInReport: true,
        screenshot: "/screenshots/cnn-scandal.png"
      },
      {
        id: 1003,
        title: "Tech CEO caught with company's HR head on Coldplay kiss cam resigns",
        url: "https://theguardian.com/andy-byron-affair",
        outlet: "The Guardian",
        tier: "Top" as const,
        focusType: "Headline" as const,
        estViews: 165000,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Married CEO's public display with subordinate leads to immediate resignation from Astronomer.",
        includedInReport: true,
        screenshot: "/screenshots/guardian-scandal.png"
      },
      {
        id: 1004,
        title: "Astronomer CEO Andy Byron Resigns After Coldplay Kiss Cam Fiasco",
        url: "https://forbes.com/andy-byron-resignation",
        outlet: "Forbes",
        tier: "Top" as const,
        focusType: "Headline" as const,
        estViews: 142000,
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Corporate scandal unfolds as CEO's inappropriate relationship exposed at public event.",
        includedInReport: true,
        screenshot: "/screenshots/forbes-scandal.png"
      },
      {
        id: 1005,
        title: "'Happy family' photos of Andy Byron and wife emerge amid affair allegations",
        url: "https://hindustantimes.com/andy-byron-family",
        outlet: "Hindustan Times",
        tier: "Mid" as const,
        focusType: "Headline" as const,
        estViews: 89000,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Recent family photos contrast sharply with CEO's public scandal at Coldplay concert.",
        includedInReport: true,
        screenshot: "/screenshots/ht-scandal.png"
      },
      {
        id: 1006,
        title: "Andy Byron's wife Megan's 'statement' has gone viral as he steps down",
        url: "https://cosmopolitan.com/andy-byron-wife-statement",
        outlet: "Cosmopolitan",
        tier: "Mid" as const,
        focusType: "Headline" as const,
        estViews: 76000,
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Wife's alleged social media response to husband's public affair goes viral online.",
        includedInReport: true,
        screenshot: "/screenshots/cosmo-scandal.png"
      },
      {
        id: 1007,
        title: "Ex-Astronomer CEO Andy Byron could sue Coldplay for kiss cam scandal",
        url: "https://pagesix.com/andy-byron-lawsuit",
        outlet: "Page Six",
        tier: "Mid" as const,
        focusType: "Headline" as const,
        estViews: 65000,
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Disgraced CEO considers legal action against band for broadcasting compromising footage.",
        includedInReport: true,
        screenshot: "/screenshots/pagesix-scandal.png"
      },
      {
        id: 1008,
        title: "Andy Byron's Wife Has Returned To FB? Her Alleged Statement On Husband's Cheating Surfaces",
        url: "https://bollywoodshaadis.com/andy-byron-wife-statement",
        outlet: "BollywoodShaadis",
        tier: "Blog" as const,
        focusType: "Headline" as const,
        estViews: 32000,
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        sentiment: "negative" as const,
        summary: "Social media buzz around wife's alleged response to CEO's public affair scandal.",
        includedInReport: true,
        screenshot: "/screenshots/blog-scandal.png"
      }
    ];

    if (includeInternational) {
      scandalArticles.push(
        {
          id: 1009,
          title: "Mysterious Woman In Astronomer CEO's Coldplay Video Identified",
          url: "https://ndtv.com/andy-byron-woman-identified",
          outlet: "NDTV",
          tier: "Mid" as const,
          focusType: "Headline" as const,
          estViews: 54000,
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          sentiment: "negative" as const,
          summary: "International media identifies woman as company HR head in viral scandal video.",
          includedInReport: true,
          screenshot: "/screenshots/ndtv-scandal.png"
        }
      );
    }

    const topCount = scandalArticles.filter(a => a.tier === "Top").length;
    const midCount = scandalArticles.filter(a => a.tier === "Mid").length;
    const blogCount = scandalArticles.filter(a => a.tier === "Blog").length;

    return {
      clientId: 'andy-byron',
      clientName: 'Andy Byron',
      date: new Date().toISOString().split('T')[0],
      articles: scandalArticles,
      summary: {
        topTierCount: topCount,
        midTierCount: midCount,
        blogCount: blogCount,
        totalMentions: scandalArticles.length,
        sentimentBreakdown: {
          positive: 0,
          neutral: 0,
          negative: scandalArticles.length, // All negative
        },
      },
      generatedAt: new Date().toISOString(),
    };
  }
  
  // Default case for other clients
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