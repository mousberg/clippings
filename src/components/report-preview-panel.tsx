"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Send, 
  ExternalLink, 
  Newspaper,
  PenTool,
  Globe,
  Clock
} from "lucide-react";
import { DailyReport, Article, ArticleTier } from "@/types";

interface ReportPreviewPanelProps {
  report: DailyReport;
  onExportPDF: () => void;
  onSendReport: () => void;
}

export function ReportPreviewPanel({ 
  report, 
  onExportPDF, 
  onSendReport 
}: ReportPreviewPanelProps) {
  const includedArticles = report.articles.filter(article => article.includedInReport);
  
  const articlesByTier = {
    Top: includedArticles.filter(article => article.tier === "Top"),
    Mid: includedArticles.filter(article => article.tier === "Mid"),
    Blog: includedArticles.filter(article => article.tier === "Blog"),
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
        return "text-blue-600";
      case "Mid":
        return "text-green-600";
      case "Blog":
        return "text-purple-600";
    }
  };

  const ArticleItem = ({ article }: { article: Article }) => (
    <div className="border rounded-lg p-4 space-y-3 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={getTierColor(article.tier)}>
              {getTierIcon(article.tier)}
              {article.tier}-Tier
            </Badge>
            <Badge variant="outline">
              {article.focusType === "Headline" ? "🟢" : "🔘"} {article.focusType}
            </Badge>
          </div>
          
          <h4 className="font-semibold text-sm leading-tight">
            {article.title}
          </h4>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="font-medium">{article.outlet}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString('en-US')}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{(article.estViews / 1000).toFixed(1)}K views</div>
            </div>
          </div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1 text-xs text-blue-600 hover:text-blue-800"
        onClick={() => window.open(article.url, '_blank')}
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        View Source
      </Button>
    </div>
  );

  return (
    <div className="h-fit bg-white/70 backdrop-blur-sm rounded-2xl border border-zinc-200/50 shadow-sm">
      <div className="p-6 border-b border-zinc-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-100 rounded-lg">
              <FileText className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Report Preview</h3>
              <p className="text-sm text-zinc-600">Ready for export</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={onExportPDF} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-50 text-zinc-700 border border-zinc-200 hover:bg-zinc-100 transition-colors"
            >
              <FileText className="h-3 w-3" />
              PDF
            </button>
            <button 
              onClick={onSendReport} 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              <Send className="h-3 w-3" />
              Email
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Report Header */}
        <div className="bg-zinc-50/50 rounded-xl p-4 space-y-2 border border-zinc-200/30">
          <h3 className="font-semibold text-lg text-zinc-900">{report.clientName} - Media Coverage Report</h3>
          <div className="text-sm text-zinc-600 space-y-1">
            <div>Date: {new Date(report.date).toLocaleDateString('en-US')}</div>
            <div>Total Coverage Items: {includedArticles.length}</div>
            {report.generatedAt && (
              <div>Generated: {new Date(report.generatedAt).toLocaleString('en-US')}</div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(articlesByTier).map(([tier, articles]) => (
            <div key={tier} className="bg-zinc-50/70 rounded-xl p-3 text-center border border-zinc-200/40">
              <div className="font-semibold text-lg text-zinc-900">{articles.length}</div>
              <div className="text-xs text-zinc-600">{tier}-Tier</div>
            </div>
          ))}
        </div>

        {/* Accordion Sections */}
        <Accordion type="multiple" defaultValue={["top", "mid", "blog"]} className="w-full">
          {Object.entries(articlesByTier).map(([tier, articles]) => (
            <AccordionItem key={tier} value={tier.toLowerCase()}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  {getTierIcon(tier as ArticleTier)}
                  <span className="font-medium">{tier}-Tier Coverage</span>
                  <Badge variant="secondary">{articles.length} items</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-3">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <ArticleItem key={article.id} article={article} />
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <div className="text-sm">No {tier.toLowerCase()}-tier coverage selected</div>
                    <div className="text-xs">Add articles from the coverage feed above</div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Export Actions */}
        {includedArticles.length > 0 && (
          <div className="pt-4 border-t border-zinc-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-zinc-600">
                Ready to generate report for <strong className="text-zinc-900">{report.clientName}</strong>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={onExportPDF} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-50 text-zinc-700 border border-zinc-200 hover:bg-zinc-100 transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  Export PDF
                </button>
                <button 
                  onClick={onSendReport} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                >
                  <Send className="h-3 w-3" />
                  Send Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}