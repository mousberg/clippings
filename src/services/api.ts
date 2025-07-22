import { DailyReport } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface GenerateReportRequest {
  clientName: string;
  includeInternational: boolean;
  date?: string;
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

  static async generateReport(request: GenerateReportRequest): Promise<DailyReport> {
    return this.request<{ report: DailyReport }>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({
        clientName: request.clientName,
        includeInternational: request.includeInternational,
        date: request.date || new Date().toISOString().split('T')[0],
      }),
    }).then(response => response.report);
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
  const { generateMockReportForClient } = await import('@/data/mockData');
  
  const report = generateMockReportForClient('1', includeInternational);
  report.clientName = clientName;
  report.clientId = clientName.toLowerCase().replace(/\s+/g, '-');
  
  return report;
}