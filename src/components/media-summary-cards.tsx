"use client";

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {/* Tier Cards */}
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.tier}
            onClick={() => onFilterClick?.(card.tier)}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-zinc-200/50 shadow-sm hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-xl ${card.bgColor} group-hover:scale-105 transition-transform duration-200`}>
                <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${card.color}`} />
              </div>
              <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-zinc-600 truncate">{card.tier}</p>
                <p className="text-lg sm:text-2xl font-bold text-zinc-900">{card.count}</p>
                <p className="text-xs text-zinc-500 hidden sm:block">{card.description}</p>
              </div>
            </div>
          </button>
        );
      })}

      {/* Sentiment Overview Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-zinc-200/50 shadow-sm col-span-2 lg:col-span-1">
        <div className="flex items-center mb-2 sm:mb-4">
          <div className="p-2 sm:p-3 bg-zinc-100 rounded-xl">
            <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-zinc-600" />
          </div>
          <div className="ml-2 sm:ml-4 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-zinc-600">Sentiment</p>
            <p className="text-lg sm:text-2xl font-bold text-zinc-900">{summary.totalMentions}</p>
            <p className="text-xs text-zinc-500 hidden sm:block">Total coverage</p>
          </div>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          {Object.entries(summary.sentimentBreakdown).map(([sentiment, count]) => (
            <div key={sentiment} className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                {getSentimentIcon(sentiment as keyof typeof summary.sentimentBreakdown)}
                <span className="text-xs sm:text-sm font-medium text-zinc-700 capitalize">{sentiment}</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-zinc-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}