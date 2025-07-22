"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    let filtered = filterTier 
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Coverage Feed
            {filterTier && (
              <Badge variant="secondary" className="ml-2">
                Filtered by {filterTier}-Tier
              </Badge>
            )}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedArticles.length} articles
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Tier</TableHead>
                <TableHead className="w-[60px]">Image</TableHead>
                <TableHead className="min-w-[300px]">Headline</TableHead>
                <TableHead>Focus</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("outlet")}
                  >
                    Source
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-semibold"
                    onClick={() => handleSort("views")}
                  >
                    Est. Views
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`flex items-center gap-1 ${getTierColor(article.tier)}`}
                    >
                      {getTierIcon(article.tier)}
                      {article.tier}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {article.screenshot ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={() => onViewScreenshot?.(article)}
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      </Button>
                    ) : (
                      <div className="w-10 h-10 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-gray-300" />
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell className="max-w-0">
                    <div className="space-y-1">
                      <div className="font-medium truncate pr-2" title={article.title}>
                        {article.title}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {article.summary}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Article
                      </Button>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className={`text-sm font-medium ${getFocusTypeColor(article.focusType)}`}>
                      {article.focusType === "Headline" ? "🟢" : "🔘"} {article.focusType}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{article.outlet}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{formatViews(article.estViews)}</div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Button
                      variant={article.includedInReport ? "default" : "outline"}
                      size="sm"
                      onClick={() => onToggleInclude(article.id, !article.includedInReport)}
                      className="flex items-center gap-1"
                    >
                      {article.includedInReport ? (
                        <>
                          <Check className="h-3 w-3" />
                          Included
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          Add to Report
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}