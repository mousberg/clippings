"use client";

import { useState, useEffect } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClientSelector } from "@/components/client-selector";
import { DatePicker } from "@/components/date-picker";
import { MediaSummaryCards } from "@/components/media-summary-cards";
import { CoverageFeedTable } from "@/components/coverage-feed-table";
import { ReportPreviewPanel } from "@/components/report-preview-panel";
import { NewReportModal } from "@/components/new-report-modal";
import { 
  mockClients, 
  mockDailyReport, 
  generateMockReportForClient 
} from "@/data/mockData";
import { DailyReport, ArticleTier } from "@/types";

export default function Home() {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentReport, setCurrentReport] = useState<DailyReport | null>(null);
  const [filterTier, setFilterTier] = useState<ArticleTier | null>(null);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Generate report when client or date changes (only if we have a selected client)
  useEffect(() => {
    if (selectedClientId && !showWelcome) {
      try {
        const report = generateMockReportForClient(selectedClientId);
        report.date = selectedDate.toISOString().split('T')[0];
        setCurrentReport(report);
      } catch (error) {
        console.error("Error generating report:", error);
        setCurrentReport(null);
      }
    }
  }, [selectedClientId, selectedDate, showWelcome]);

  const handleToggleArticleInclude = (articleId: number, include: boolean) => {
    setCurrentReport(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        articles: prev.articles.map(article => 
          article.id === articleId 
            ? { ...article, includedInReport: include }
            : article
        )
      };
    });
  };

  const handleTierFilter = (tier: ArticleTier) => {
    setFilterTier(filterTier === tier ? null : tier);
  };

  const handleNewReport = () => {
    setIsNewReportModalOpen(true);
  };

  const handleWelcomeClientSelect = (clientId: string, includeInternational: boolean) => {
    const report = generateMockReportForClient(clientId, includeInternational);
    report.date = selectedDate.toISOString().split('T')[0];
    
    // Update the current selections and hide welcome screen
    setSelectedClientId(clientId);
    setCurrentReport(report);
    setShowWelcome(false);
    
    console.log(`Generated new ${includeInternational ? 'international' : 'UK'} report for`, report.clientName);
  };

  const handleGenerateReport = (clientId: string, includeInternational: boolean) => {
    const report = generateMockReportForClient(clientId, includeInternational);
    report.date = selectedDate.toISOString().split('T')[0];
    
    // Update the current selections to match the generated report
    setSelectedClientId(clientId);
    setCurrentReport(report);
    
    console.log(`Generated new ${includeInternational ? 'international' : 'UK'} report for`, report.clientName);
  };

  const handleExportPDF = () => {
    if (!currentReport) return;
    console.log("Exporting PDF for", currentReport.clientName);
    alert(`Exporting PDF report for ${currentReport.clientName} - ${currentReport.date}`);
  };

  const handleSendReport = () => {
    if (!currentReport) return;
    console.log("Sending report for", currentReport.clientName);
    alert(`Sending report for ${currentReport.clientName} via email`);
  };

  const handleLogoClick = () => {
    setShowWelcome(true);
    setCurrentReport(null);
    setSelectedClientId("");
    setFilterTier(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  // Show welcome screen if no report is selected
  if (showWelcome || !currentReport) {
    return (
      <WelcomeScreen
        clients={mockClients}
        onClientSelect={handleWelcomeClientSelect}
      />
    );
  }

  return (
    <DashboardLayout
      selectedDate={formatDate(selectedDate)}
      onNewReport={handleNewReport}
      onExportPDF={handleExportPDF}
      onSendReport={handleSendReport}
      onLogoClick={handleLogoClick}
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

      {/* New Report Modal */}
      <NewReportModal
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        clients={mockClients}
        onGenerateReport={handleGenerateReport}
      />
    </DashboardLayout>
  );
}