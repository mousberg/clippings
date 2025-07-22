"use client";

import { Button } from "@/components/ui/button";
import { Plus, FileText, Send } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  selectedClient: string;
  selectedDate: string;
  onNewReport: () => void;
  onExportPDF: () => void;
  onSendReport: () => void;
  onLogoClick?: () => void;
  isExportingPDF?: boolean;
}

export function Header({
  selectedDate,
  onNewReport,
  onExportPDF,
  onSendReport,
  onLogoClick,
  isExportingPDF = false,
}: Omit<HeaderProps, 'selectedClient'>) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-75 transition-opacity duration-200"
            title="Return to home"
          >
            <Image 
              src="/clippings-logo.svg" 
              alt="Clippings" 
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Report for:</span>
            <span className="text-sm font-medium">{selectedDate}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={onNewReport} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
          <Button 
            onClick={onExportPDF} 
            variant="outline" 
            size="sm"
            disabled={isExportingPDF}
          >
            {isExportingPDF ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
          <Button onClick={onSendReport} size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </header>
  );
}