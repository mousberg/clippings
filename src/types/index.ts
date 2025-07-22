export type ArticleTier = "Top" | "Mid" | "Blog";
export type ClientFocusType = "Headline" | "Mention";
export type SentimentType = "positive" | "neutral" | "negative";

export interface Article {
  id: number;
  title: string;
  url: string;
  outlet: string;
  tier: ArticleTier;
  focusType: ClientFocusType;
  estViews: number;
  screenshot?: string;
  publishedAt: string;
  sentiment: SentimentType;
  summary: string;
  includedInReport: boolean;
}

export interface Client {
  id: string;
  name: string;
  industry?: string;
  isActive: boolean;
}

export interface MediaSummary {
  topTierCount: number;
  midTierCount: number;
  blogCount: number;
  totalMentions: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface DailyReport {
  clientId: string;
  clientName: string;
  date: string;
  articles: Article[];
  summary: MediaSummary;
  generatedAt?: string;
}