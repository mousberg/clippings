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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Tier Cards */}
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.tier}
            onClick={() => onFilterClick?.(card.tier)}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/50 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-105 transition-transform duration-200`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-zinc-600">{card.tier}-Tier</p>
                <p className="text-2xl font-bold text-zinc-900">{card.count}</p>
                <p className="text-xs text-zinc-500">{card.description}</p>
              </div>
            </div>
          </button>
        );
      })}

      {/* Sentiment Overview Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/50 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-zinc-100 rounded-xl">
            <TrendingUp className="h-6 w-6 text-zinc-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-zinc-600">Sentiment</p>
            <p className="text-2xl font-bold text-zinc-900">{summary.totalMentions}</p>
            <p className="text-xs text-zinc-500">Total coverage</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {Object.entries(summary.sentimentBreakdown).map(([sentiment, count]) => (
            <div key={sentiment} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSentimentIcon(sentiment as keyof typeof summary.sentimentBreakdown)}
                <span className="text-sm font-medium text-zinc-700 capitalize">{sentiment}</span>
              </div>
              <span className="text-sm font-semibold text-zinc-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}