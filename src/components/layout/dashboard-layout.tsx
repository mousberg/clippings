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
}

export function DashboardLayout({
  children,
  selectedDate,
  onNewReport,
  onExportPDF,
  onSendReport,
  onLogoClick,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedDate={selectedDate}
        onNewReport={onNewReport}
        onExportPDF={onExportPDF}
        onSendReport={onSendReport}
        onLogoClick={onLogoClick}
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}