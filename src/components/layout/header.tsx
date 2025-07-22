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
}

export function Header({
  selectedDate,
  onNewReport,
  onExportPDF,
  onSendReport,
}: Omit<HeaderProps, 'selectedClient'>) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Image 
              src="/clippings-logo.svg" 
              alt="Clippings" 
              width={32}
              height={32}
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