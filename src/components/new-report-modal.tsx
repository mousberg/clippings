"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search,
  Globe,
  MapPin,
  Sparkles
} from "lucide-react";
import { Client } from "@/types";

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onGenerateReport: (clientId: string, includeInternational: boolean) => void;
}

export function NewReportModal({ 
  isOpen, 
  onClose, 
  clients,
  onGenerateReport 
}: NewReportModalProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [includeInternational, setIncludeInternational] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredClients = clients.filter(client => 
    client.isActive && 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const handleGenerate = async () => {
    if (!selectedClientId) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onGenerateReport(selectedClientId, includeInternational);
    
    // Reset form
    setSelectedClientId("");
    setIncludeInternational(false);
    setSearchQuery("");
    setIsGenerating(false);
    onClose();
  };

  const handleClose = () => {
    setSelectedClientId("");
    setIncludeInternational(false);
    setSearchQuery("");
    setIsGenerating(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Generate New Report
          </DialogTitle>
          <DialogDescription>
            Select a client and configure report settings to generate a new media coverage report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Which client is this report for?</label>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Client List */}
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center justify-between ${
                      selectedClientId === client.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">{client.industry}</div>
                    </div>
                    {selectedClientId === client.id && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Selected
                      </Badge>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-muted-foreground">
                  <div className="text-sm">No clients found</div>
                  <div className="text-xs">Try adjusting your search</div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Client Display */}
          {selectedClient && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-blue-900">{selectedClient.name}</div>
                  <div className="text-sm text-blue-700">{selectedClient.industry} • Ready to generate</div>
                </div>
              </div>
            </div>
          )}

          {/* International Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Coverage Scope</label>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3">
                {includeInternational ? (
                  <Globe className="h-5 w-5 text-green-600" />
                ) : (
                  <MapPin className="h-5 w-5 text-blue-600" />
                )}
                <div>
                  <div className="font-medium">
                    {includeInternational ? "International Coverage" : "UK Coverage Only"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {includeInternational 
                      ? "Include global news sources and international outlets"
                      : "Focus on UK-based news sources and domestic coverage"
                    }
                  </div>
                </div>
              </div>
              <Switch
                checked={includeInternational}
                onCheckedChange={setIncludeInternational}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedClientId || isGenerating}
            className="min-w-32"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Report
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}