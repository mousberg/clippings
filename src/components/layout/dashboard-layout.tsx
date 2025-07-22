"use client";

import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  selectedClient: string;
  selectedDate: string;
  onNewReport: () => void;
  onExportPDF: () => void;
  onSendReport: () => void;
}

export function DashboardLayout({
  children,
  selectedClient,
  selectedDate,
  onNewReport,
  onExportPDF,
  onSendReport,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedClient={selectedClient}
        selectedDate={selectedDate}
        onNewReport={onNewReport}
        onExportPDF={onExportPDF}
        onSendReport={onSendReport}
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