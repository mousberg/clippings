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
    <Card className="h-fit bg-white/90 backdrop-blur-sm shadow-lg border-white/20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 flex-shrink-0" />
            <span>Report Preview</span>
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={onExportPDF} variant="outline" size="sm" className="whitespace-nowrap text-xs px-3">
              <FileText className="h-3 w-3 mr-1" />
              PDF
            </Button>
            <Button onClick={onSendReport} size="sm" className="whitespace-nowrap text-xs px-3">
              <Send className="h-3 w-3 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Report Header */}
        <div className="bg-gradient-to-r from-gray-50/80 to-white/50 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-white/30">
          <h3 className="font-semibold text-lg">{report.clientName} - Media Coverage Report</h3>
          <div className="text-sm text-muted-foreground">
            <div>Date: {new Date(report.date).toLocaleDateString('en-US')}</div>
            <div>Total Coverage Items: {includedArticles.length}</div>
            {report.generatedAt && (
              <div>Generated: {new Date(report.generatedAt).toLocaleString('en-US')}</div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(articlesByTier).map(([tier, articles]) => (
            <div key={tier} className="bg-gradient-to-br from-white/70 to-gray-50/70 backdrop-blur-sm rounded p-3 text-center border border-white/40 shadow-sm">
              <div className="font-semibold text-lg">{articles.length}</div>
              <div className="text-xs text-muted-foreground">{tier}-Tier</div>
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
          <div className="pt-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Ready to generate report for <strong>{report.clientName}</strong>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button onClick={onExportPDF} variant="outline" size="sm" className="whitespace-nowrap text-xs px-3">
                  <FileText className="h-3 w-3 mr-1" />
                  Export PDF
                </Button>
                <Button onClick={onSendReport} size="sm" className="whitespace-nowrap text-xs px-3">
                  <Send className="h-3 w-3 mr-1" />
                  Send Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}