"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, 
  PenTool, 
  Globe, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { MediaSummary } from "@/types";

interface MediaSummaryCardsProps {
  summary: MediaSummary;
  onFilterClick?: (tier: "Top" | "Mid" | "Blog") => void;
}

export function MediaSummaryCards({ summary, onFilterClick }: MediaSummaryCardsProps) {
  const cards = [
    {
      title: "Top-Tier Mentions",
      count: summary.topTierCount,
      icon: Newspaper,
      tier: "Top" as const,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Premium publications",
    },
    {
      title: "Mid-Tier Mentions", 
      count: summary.midTierCount,
      icon: PenTool,
      tier: "Mid" as const,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Industry publications",
    },
    {
      title: "Blogs/Social",
      count: summary.blogCount,
      icon: Globe,
      tier: "Blog" as const,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Online mentions",
    },
  ];

  const getSentimentIcon = (sentiment: keyof typeof summary.sentimentBreakdown) => {
    switch (sentiment) {
      case "positive":
        return <ArrowUpRight className="h-3 w-3 text-green-500" />;
      case "negative":
        return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.tier}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onFilterClick?.(card.tier)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sentiment Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            Sentiment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(summary.sentimentBreakdown).map(([sentiment, count]) => (
              <div key={sentiment} className="flex items-center gap-2">
                {getSentimentIcon(sentiment as keyof typeof summary.sentimentBreakdown)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{sentiment}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        sentiment === "positive" 
                          ? "bg-green-500" 
                          : sentiment === "negative" 
                          ? "bg-red-500" 
                          : "bg-gray-500"
                      }`}
                      style={{ 
                        width: `${(count / summary.totalMentions) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{summary.totalMentions}</div>
              <div className="text-sm text-muted-foreground">Total Mentions Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}