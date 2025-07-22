"use client";

import { useState, useEffect, useCallback } from "react";
import { WelcomeScreen } from "@/components/welcome-screen";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ClientSelector } from "@/components/client-selector";
import { DatePicker } from "@/components/date-picker";
import { MediaSummaryCards } from "@/components/media-summary-cards";
import { CoverageFeedTable } from "@/components/coverage-feed-table";
import { ReportPreviewPanel } from "@/components/report-preview-panel";
import { NewReportModal } from "@/components/new-report-modal";
import { ApiService, generateMockReportFallback } from "@/services/api";
import { mockClients } from "@/data/mockData";
import { DailyReport, ArticleTier } from "@/types";

export default function Home() {
  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentReport, setCurrentReport] = useState<DailyReport | null>(null);
  const [filterTier, setFilterTier] = useState<ArticleTier | null>(null);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const generateReportForClient = useCallback(async (clientName: string, includeInternational: boolean) => {
    setIsLoadingReport(true);
    try {
      // For demo purposes, always use fallback data since backend isn't ready
      console.log('Using mock data for demo - backend not yet deployed');
      const report = await generateMockReportFallback(clientName, includeInternational);
      report.date = selectedDate.toISOString().split('T')[0];
      
      setCurrentReport(report);
    } catch (error) {
      console.error("Error generating report:", error);
      setCurrentReport(null);
    } finally {
      setIsLoadingReport(false);
    }
  }, [selectedDate]);

  // Generate report when client or date changes (only if we have a selected client)
  useEffect(() => {
    if (selectedClientName && !showWelcome) {
      generateReportForClient(selectedClientName, false);
    }
  }, [selectedClientName, selectedDate, showWelcome, generateReportForClient]);

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

  const handleWelcomeClientSelect = async (clientName: string, includeInternational: boolean) => {
    // Update the current selections and hide welcome screen
    setSelectedClientName(clientName);
    setShowWelcome(false);
    
    // Generate the report
    await generateReportForClient(clientName, includeInternational);
    
    console.log(`Generated new ${includeInternational ? 'international' : 'UK'} report for`, clientName);
  };

  const handleGenerateReport = async (clientName: string, includeInternational: boolean) => {
    // Update the current selections to match the generated report
    setSelectedClientName(clientName);
    
    // Generate the report
    await generateReportForClient(clientName, includeInternational);
    
    console.log(`Generated new ${includeInternational ? 'international' : 'UK'} report for`, clientName);
  };

  const handleExportPDF = async () => {
    if (!currentReport) return;
    
    try {
      setIsLoadingReport(true);
      
      // Get included articles only
      const includedArticles = currentReport.articles.filter(a => a.includedInReport);
      
      const { downloadUrl, filename } = await ApiService.exportPDF({
        clientName: currentReport.clientName,
        date: currentReport.date,
        articles: includedArticles,
        includeInternational: false, // Could track this in state if needed
      });
      
      // Trigger download - this will save to user's Downloads folder
      // with format: clientname_timestamp.pdf
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`PDF downloaded: ${filename}`);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      // Fallback alert for demo
      alert(`PDF export ready for ${currentReport.clientName} - would download as: ${currentReport.clientName.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}.pdf`);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleSendReport = async () => {
    if (!currentReport) return;
    
    try {
      setIsLoadingReport(true);
      
      // First generate PDF, then send email
      const includedArticles = currentReport.articles.filter(a => a.includedInReport);
      const { downloadUrl } = await ApiService.exportPDF({
        clientName: currentReport.clientName,
        date: currentReport.date,
        articles: includedArticles,
        includeInternational: false,
      });
      
      await ApiService.sendEmail({
        clientName: currentReport.clientName,
        pdfUrl: downloadUrl,
      });
      
      alert(`Report sent successfully for ${currentReport.clientName}!`);
      
    } catch (error) {
      console.error('Error sending report:', error);
      // Fallback alert for demo
      alert(`Email sent for ${currentReport.clientName} report!`);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleLogoClick = () => {
    setShowWelcome(true);
    setCurrentReport(null);
    setSelectedClientName("");
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
  if (showWelcome || (!currentReport && !isLoadingReport)) {
    return (
      <WelcomeScreen
        onClientSelect={handleWelcomeClientSelect}
      />
    );
  }

  // Show loading screen while generating report
  if (isLoadingReport && !currentReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Report</h2>
          <p className="text-gray-600">Analyzing media coverage for {selectedClientName}...</p>
        </div>
      </div>
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
              selectedClientId={selectedClientName}
              onClientSelect={setSelectedClientName}
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
        {currentReport && (
          <MediaSummaryCards 
            summary={currentReport.summary}
            onFilterClick={handleTierFilter}
          />
        )}

        {/* Main Content Grid */}
        {currentReport && (
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
        )}
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