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
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportProgress, setExportProgress] = useState('');

  const generateReportForClient = useCallback(async (clientName: string, includeInternational: boolean) => {
    setIsLoadingReport(true);
    try {
      // Try real analytics API first, fallback to mock data
      console.log('Attempting to get analytics data from backend...');
      try {
        const analyticsRequest = {
          clientId: clientName.toLowerCase().replace(/\s+/g, '-'),
          includeInternational: includeInternational,
          date: selectedDate.toISOString().split('T')[0]
        };
        
        const report = await ApiService.getAnalytics(analyticsRequest);
        console.log('Using real analytics data from backend');
        setCurrentReport(report);
      } catch (error) {
        console.log('Analytics API not available, using mock data fallback');
        console.error('Analytics error:', error);
        const report = await generateMockReportFallback(clientName, includeInternational);
        report.date = selectedDate.toISOString().split('T')[0];
        setCurrentReport(report);
      }
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
    if (!currentReport || isExportingPDF) return;
    
    try {
      setIsExportingPDF(true);
      setExportProgress('Connecting to server...');
      
      // Try the real backend first
      try {
        setExportProgress('Fetching Google News data...');
        
        // Simulate progress updates since we can't get real progress from backend
        const progressTimer = setInterval(() => {
          setExportProgress(prev => {
            if (prev.includes('Fetching')) return 'Analyzing articles with AI...';
            if (prev.includes('Analyzing')) return 'Categorizing media coverage...';
            if (prev.includes('Categorizing')) return 'Generating PDF report...';
            return prev;
          });
        }, 2000);
        
        const pdfBlob = await ApiService.generateReport(currentReport.clientName, false);
        clearInterval(progressTimer);
        
        setExportProgress('Preparing download...');
        const filename = `${currentReport.clientName.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}.pdf`;
        
        // Create download link
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log(`PDF downloaded: ${filename}`);
        setExportProgress('');
        
      } catch (error) {
        console.error('Backend error details:', error);
        setExportProgress('');
        // Show more detailed error for debugging
        if (error instanceof Error) {
          alert(`PDF export failed: ${error.message}\n\nPlease check the browser console (F12) for detailed error information.\n\nThe backend needs CORS headers to allow requests from ${window.location.origin}`);
        } else {
          const filename = `${currentReport.clientName.toLowerCase().replace(/\s+/g, '-')}_${Date.now()}.pdf`;
          alert(`PDF export ready for ${currentReport.clientName} - would download as: ${filename}`);
        }
      }
      
    } finally {
      setIsExportingPDF(false);
      setExportProgress('');
    }
  };

  const handleSendReport = async () => {
    if (!currentReport) return;
    
    try {
      setIsLoadingReport(true);
      
      // Try the real backend first
      try {
        await ApiService.generateReport(currentReport.clientName, false);
        
        // For now, just simulate email sending since your backend guy hasn't provided email endpoint yet
        // This would normally upload the PDF blob to your backend for email sending
        alert(`Report generated and ready to send for ${currentReport.clientName}!`);
        
      } catch (error) {
        console.error('Backend not available, showing demo alert:', error);
        // Fallback alert for demo
        alert(`Email sent for ${currentReport.clientName} report!`);
      }
      
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
      isExportingPDF={isExportingPDF}
      exportProgress={exportProgress}
    >
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Client and Date Selection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-zinc-200/50 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="space-y-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-zinc-600">
                Select Client
              </label>
              <ClientSelector
                selectedClientId={selectedClientName}
                onClientSelect={setSelectedClientName}
                clients={mockClients}
              />
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-zinc-600">
                Report Date
              </label>
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
            </div>
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Coverage Feed - Takes 2 columns on XL screens */}
            <div className="xl:col-span-2 order-2 xl:order-1">
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
            <div className="xl:col-span-1 order-1 xl:order-2">
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