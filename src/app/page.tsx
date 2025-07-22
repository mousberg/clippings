"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClientSelector } from "@/components/client-selector";
import { DatePicker } from "@/components/date-picker";
import { MediaSummaryCards } from "@/components/media-summary-cards";
import { CoverageFeedTable } from "@/components/coverage-feed-table";
import { ReportPreviewPanel } from "@/components/report-preview-panel";
import { 
  mockClients, 
  mockDailyReport, 
  generateMockReportForClient 
} from "@/data/mockData";
import { DailyReport, ArticleTier } from "@/types";

export default function Home() {
  const [selectedClientId, setSelectedClientId] = useState("1");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentReport, setCurrentReport] = useState<DailyReport>(mockDailyReport);
  const [filterTier, setFilterTier] = useState<ArticleTier | null>(null);

  // Generate report when client or date changes
  useEffect(() => {
    try {
      const report = generateMockReportForClient(selectedClientId);
      report.date = selectedDate.toISOString().split('T')[0];
      setCurrentReport(report);
    } catch (error) {
      console.error("Error generating report:", error);
      setCurrentReport(mockDailyReport);
    }
  }, [selectedClientId, selectedDate]);

  const handleToggleArticleInclude = (articleId: number, include: boolean) => {
    setCurrentReport(prev => ({
      ...prev,
      articles: prev.articles.map(article => 
        article.id === articleId 
          ? { ...article, includedInReport: include }
          : article
      )
    }));
  };

  const handleTierFilter = (tier: ArticleTier) => {
    setFilterTier(filterTier === tier ? null : tier);
  };

  const handleNewReport = () => {
    const report = generateMockReportForClient(selectedClientId);
    report.date = selectedDate.toISOString().split('T')[0];
    setCurrentReport(report);
    console.log("Generated new report for", report.clientName);
  };

  const handleExportPDF = () => {
    console.log("Exporting PDF for", currentReport.clientName);
    alert(`Exporting PDF report for ${currentReport.clientName} - ${currentReport.date}`);
  };

  const handleSendReport = () => {
    console.log("Sending report for", currentReport.clientName);
    alert(`Sending report for ${currentReport.clientName} via email`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  return (
    <DashboardLayout
      selectedClient={currentReport.clientName}
      selectedDate={formatDate(selectedDate)}
      onNewReport={handleNewReport}
      onExportPDF={handleExportPDF}
      onSendReport={handleSendReport}
    >
      <div className="space-y-6">
        {/* Client and Date Selection */}
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Select Client
            </label>
            <ClientSelector
              selectedClientId={selectedClientId}
              onClientSelect={setSelectedClientId}
              clients={mockClients}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Report Date
            </label>
            <DatePicker
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
        </div>

        {/* Media Summary Cards */}
        <MediaSummaryCards 
          summary={currentReport.summary}
          onFilterClick={handleTierFilter}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Coverage Feed - Takes 2 columns on XL screens */}
          <div className="xl:col-span-2">
            <CoverageFeedTable
              articles={currentReport.articles}
              onToggleInclude={handleToggleArticleInclude}
              filterTier={filterTier}
              onViewScreenshot={(article) => {
                console.log("Viewing screenshot for:", article.title);
                alert(`Screenshot preview: ${article.title}`);
              }}
            />
          </div>

          {/* Report Preview Panel - Takes 1 column on XL screens */}
          <div className="xl:col-span-1">
            <ReportPreviewPanel
              report={currentReport}
              onExportPDF={handleExportPDF}
              onSendReport={handleSendReport}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}