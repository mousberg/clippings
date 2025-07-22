"use client";

import { Button } from "@/components/ui/button";
import { Plus, FileText, Send } from "lucide-react";

interface HeaderProps {
  selectedClient: string;
  selectedDate: string;
  onNewReport: () => void;
  onExportPDF: () => void;
  onSendReport: () => void;
}

export function Header({
  selectedClient,
  selectedDate,
  onNewReport,
  onExportPDF,
  onSendReport,
}: HeaderProps) {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/clippings-logo.svg" 
              alt="Clippings" 
              className="h-8 w-auto"
            />
          </div>
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
          <Button onClick={onExportPDF} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
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