"use client";

import { useState, useMemo } from "react";
import { 
  ExternalLink, 
  Check, 
  X, 
  ArrowUpDown,
  Filter,
  Image as ImageIcon,
  Newspaper,
  PenTool,
  Globe
} from "lucide-react";
import { Article, ArticleTier } from "@/types";

interface CoverageFeedTableProps {
  articles: Article[];
  onToggleInclude: (articleId: number, include: boolean) => void;
  onViewScreenshot?: (article: Article) => void;
  filterTier?: ArticleTier | null;
}

export function CoverageFeedTable({ 
  articles, 
  onToggleInclude, 
  onViewScreenshot,
  filterTier 
}: CoverageFeedTableProps) {
  const [sortBy, setSortBy] = useState<"date" | "views" | "outlet">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    const filtered = filterTier 
      ? articles.filter(article => article.tier === filterTier)
      : articles;

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.publishedAt).getTime();
          bValue = new Date(b.publishedAt).getTime();
          break;
        case "views":
          aValue = a.estViews;
          bValue = b.estViews;
          break;
        case "outlet":
          aValue = a.outlet.toLowerCase();
          bValue = b.outlet.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [articles, filterTier, sortBy, sortOrder]);

  const handleSort = (field: "date" | "views" | "outlet") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getTierIcon = (tier: ArticleTier) => {
    switch (tier) {
      case "Top":
        return <Newspaper className="h-4 w-4" />;
      case "Mid":
        return <PenTool className="h-4 w-4" />;
      case "Blog":
        return <Globe className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: ArticleTier) => {
    switch (tier) {
      case "Top":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Mid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Blog":
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  const getFocusTypeColor = (focusType: "Headline" | "Mention") => {
    return focusType === "Headline" 
      ? "text-green-600" 
      : "text-gray-600";
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-zinc-200/50 shadow-sm">
      <div className="p-6 border-b border-zinc-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-lg">
              <Filter className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Coverage Feed</h3>
              {filterTier && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mt-1">
                  Filtered by {filterTier}-Tier
                </span>
              )}
            </div>
          </div>
          <div className="text-sm font-medium text-zinc-600">
            {filteredAndSortedArticles.length} articles
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-200/50">
            <tr>
              <th className="text-left py-2 px-4 text-xs font-medium text-zinc-600">Tier</th>
              <th className="text-left py-2 px-4 text-xs font-medium text-zinc-600 w-12"></th>
              <th className="text-left py-2 px-4 text-xs font-medium text-zinc-600 min-w-[200px]">Headline</th>
              <th className="text-left py-2 px-4 text-xs font-medium text-zinc-600 hidden md:table-cell">Focus</th>
              <th className="text-left py-2 px-4 text-xs font-medium text-zinc-600">
                <button
                  className="flex items-center gap-1 hover:text-zinc-900 transition-colors"
                  onClick={() => handleSort("outlet")}
                >
                  Source
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left py-2 px-4 text-xs font-medium text-zinc-600 hidden lg:table-cell">
                <button
                  className="flex items-center gap-1 hover:text-zinc-900 transition-colors"
                  onClick={() => handleSort("views")}
                >
                  Views
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-center py-2 px-4 text-xs font-medium text-zinc-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50">
            {filteredAndSortedArticles.map((article) => (
              <tr key={article.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="py-2.5 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTierColor(article.tier)}`}>
                    {getTierIcon(article.tier)}
                    {article.tier}
                  </span>
                </td>
                
                <td className="py-2.5 px-4">
                  {article.screenshot ? (
                    <button
                      className="group-hover:scale-105 transition-transform duration-200"
                      onClick={() => onViewScreenshot?.(article)}
                    >
                      <div className="w-8 h-8 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                        <ImageIcon className="h-3 w-3 text-zinc-500" />
                      </div>
                    </button>
                  ) : (
                    <div className="w-8 h-8 bg-zinc-50 rounded border border-zinc-200 flex items-center justify-center">
                      <ImageIcon className="h-3 w-3 text-zinc-400" />
                    </div>
                  )}
                </td>
                
                <td className="py-2.5 px-4">
                  <div className="space-y-1">
                    <div className="font-medium text-sm text-zinc-900 truncate pr-2 group-hover:text-zinc-700 transition-colors" title={article.title}>
                      {article.title}
                    </div>
                    <div className="text-xs text-zinc-600 line-clamp-1">
                      {article.summary}
                    </div>
                    <button
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      View
                    </button>
                  </div>
                </td>
                
                <td className="py-2.5 px-4 hidden md:table-cell">
                  <div className={`text-xs font-medium ${getFocusTypeColor(article.focusType)} flex items-center gap-1`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${article.focusType === "Headline" ? "bg-green-500" : "bg-zinc-400"}`}></div>
                    {article.focusType}
                  </div>
                </td>
                
                <td className="py-2.5 px-4">
                  <div className="font-medium text-sm text-zinc-900">{article.outlet}</div>
                  <div className="text-xs text-zinc-500">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </td>
                
                <td className="py-2.5 px-4 hidden lg:table-cell">
                  <div className="font-semibold text-sm text-zinc-900">{formatViews(article.estViews)}</div>
                </td>
                
                <td className="py-2.5 px-4 text-center">
                  <button
                    onClick={() => onToggleInclude(article.id, !article.includedInReport)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                      article.includedInReport 
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" 
                        : "bg-zinc-50 text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    {article.includedInReport ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span className="hidden sm:inline">Included</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" />
                        <span className="hidden sm:inline">Add</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}