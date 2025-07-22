import { Article, Client, DailyReport, MediaSummary } from "@/types";

export const mockClients: Client[] = [
  { id: "1", name: "Beyoncé", industry: "Music", isActive: true },
  { id: "2", name: "Harry Styles", industry: "Music", isActive: true },
  { id: "3", name: "Taylor Swift", industry: "Music", isActive: true },
  { id: "4", name: "Netflix", industry: "Entertainment", isActive: true },
  { id: "5", name: "Apple", industry: "Technology", isActive: true },
  // Add more clients to simulate 80+ client list
  ...Array.from({ length: 75 }, (_, i) => ({
    id: (i + 6).toString(),
    name: `Client ${i + 6}`,
    industry: ["Technology", "Entertainment", "Fashion", "Sports", "Finance"][i % 5],
    isActive: i % 10 !== 0, // Some inactive clients
  })),
];

export const mockArticles: Article[] = [
  {
    id: 1,
    title: "Beyoncé's London Show Makes Headlines Worldwide",
    url: "https://bbc.co.uk/article123",
    outlet: "BBC",
    tier: "Top",
    focusType: "Headline",
    estViews: 120000,
    screenshot: "/screenshots/bbc-beyonce.png",
    publishedAt: "2025-07-22T10:30:00Z",
    sentiment: "positive",
    summary: "Comprehensive coverage of Beyoncé's sold-out London performance at Wembley Stadium.",
    includedInReport: true,
  },
  {
    id: 2,
    title: "A Deep Dive into UK Pop Culture This Week",
    url: "https://nme.com/features/uk-pop-culture",
    outlet: "NME",
    tier: "Mid",
    focusType: "Mention",
    estViews: 12000,
    screenshot: "/screenshots/nme-culture.png",
    publishedAt: "2025-07-22T08:15:00Z",
    sentiment: "neutral",
    summary: "Weekly roundup mentions Beyoncé's tour impact on UK music scene.",
    includedInReport: true,
  },
  {
    id: 3,
    title: "Concert Review: An Unforgettable Night",
    url: "https://guardian.com/music/reviews/beyonce-wembley",
    outlet: "The Guardian",
    tier: "Top",
    focusType: "Headline",
    estViews: 85000,
    screenshot: "/screenshots/guardian-review.png",
    publishedAt: "2025-07-22T07:00:00Z",
    sentiment: "positive",
    summary: "Five-star review of Beyoncé's spectacular Wembley performance.",
    includedInReport: true,
  },
  {
    id: 4,
    title: "Social Media Buzz Around Latest Tour",
    url: "https://buzzfeed.com/music/tour-social-media",
    outlet: "BuzzFeed",
    tier: "Blog",
    focusType: "Mention",
    estViews: 35000,
    screenshot: "/screenshots/buzzfeed-social.png",
    publishedAt: "2025-07-22T12:45:00Z",
    sentiment: "positive",
    summary: "Analysis of social media reactions and fan responses to the tour.",
    includedInReport: false,
  },
  {
    id: 5,
    title: "Music Industry Weekly: Chart Updates",
    url: "https://billboard.com/charts/weekly-update",
    outlet: "Billboard",
    tier: "Mid",
    focusType: "Mention",
    estViews: 28000,
    screenshot: "/screenshots/billboard-charts.png",
    publishedAt: "2025-07-22T06:30:00Z",
    sentiment: "neutral",
    summary: "Brief mention in weekly chart analysis and industry updates.",
    includedInReport: true,
  },
];

export const mockSummary: MediaSummary = {
  topTierCount: 16,
  midTierCount: 23,
  blogCount: 42,
  totalMentions: 81,
  sentimentBreakdown: {
    positive: 45,
    neutral: 28,
    negative: 8,
  },
};

export const mockDailyReport: DailyReport = {
  clientId: "1",
  clientName: "Beyoncé",
  date: "2025-07-22",
  articles: mockArticles,
  summary: mockSummary,
  generatedAt: "2025-07-22T15:00:00Z",
};

// Helper function to generate sample data for different clients
export function generateMockReportForClient(clientId: string, includeInternational: boolean = false): DailyReport {
  const client = mockClients.find(c => c.id === clientId);
  if (!client) throw new Error(`Client ${clientId} not found`);

  // Define outlet pools based on coverage scope
  const ukOutlets = ["BBC", "The Guardian", "The Times", "Sky News", "Independent"];
  const internationalOutlets = ["CNN", "Reuters", "AP", "Bloomberg", "Wall Street Journal", "New York Times", "France24"];
  const outlets = includeInternational ? [...ukOutlets, ...internationalOutlets] : ukOutlets;

  // Generate more articles for international coverage
  const articleCount = includeInternational ? Math.floor(Math.random() * 15) + 8 : Math.floor(Math.random() * 10) + 3;

  // Generate some sample articles with random data
  const sampleArticles: Article[] = Array.from({ length: articleCount }, (_, i) => ({
    id: i + 1000 + parseInt(clientId) * 100,
    title: `${client.name} ${["Makes Headlines", "In the News", "Featured Story", "Breaking News", "Global Coverage", "International Spotlight"][i % 6]}`,
    url: `https://example.com/article${i}`,
    outlet: outlets[i % outlets.length],
    tier: (["Top", "Mid", "Blog"] as const)[i % 3],
    focusType: (["Headline", "Mention"] as const)[i % 2],
    estViews: Math.floor(Math.random() * 100000) + 1000,
    publishedAt: new Date().toISOString(),
    sentiment: (["positive", "neutral", "negative"] as const)[i % 3],
    summary: `${includeInternational ? 'International' : 'UK'} coverage about ${client.name}.`,
    includedInReport: Math.random() > 0.3,
  }));

  const topCount = sampleArticles.filter(a => a.tier === "Top").length;
  const midCount = sampleArticles.filter(a => a.tier === "Mid").length;
  const blogCount = sampleArticles.filter(a => a.tier === "Blog").length;

  return {
    clientId: client.id,
    clientName: client.name,
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
  };
}