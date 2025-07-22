"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  selectedDate: string;
  onNewReport: () => void;
  onExportPDF: () => void;
  onSendReport: () => void;
  onLogoClick?: () => void;
  isExportingPDF?: boolean;
  exportProgress?: string;
}

export function DashboardLayout({
  children,
  selectedDate,
  onNewReport,
  onExportPDF,
  onSendReport,
  onLogoClick,
  isExportingPDF = false,
  exportProgress = '',
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <Header
        selectedDate={selectedDate}
        onNewReport={onNewReport}
        onExportPDF={onExportPDF}
        onSendReport={onSendReport}
        onLogoClick={onLogoClick}
        isExportingPDF={isExportingPDF}
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* PDF Export Loading Overlay */}
      {isExportingPDF && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Logo or Spinner */}
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
              </div>
              
              {/* Progress Text */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Generating Report</h3>
                <p className="text-gray-600 animate-pulse">{exportProgress || 'Processing...'}</p>
              </div>
              
              {/* Progress Steps */}
              <div className="w-full space-y-2 text-sm">
                <div className={`flex items-center gap-2 ${exportProgress.includes('Connecting') ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${exportProgress.includes('Connecting') ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <span>Connecting to server</span>
                </div>
                <div className={`flex items-center gap-2 ${exportProgress.includes('Fetching') ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${exportProgress.includes('Fetching') ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <span>Fetching Google News data</span>
                </div>
                <div className={`flex items-center gap-2 ${exportProgress.includes('Analyzing') ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${exportProgress.includes('Analyzing') ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <span>AI analysis with Google Gemini</span>
                </div>
                <div className={`flex items-center gap-2 ${exportProgress.includes('Categorizing') ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${exportProgress.includes('Categorizing') ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <span>Categorizing media tiers</span>
                </div>
                <div className={`flex items-center gap-2 ${exportProgress.includes('Generating PDF') ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${exportProgress.includes('Generating PDF') ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <span>Creating PDF report</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 text-center">This usually takes 8-12 seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}