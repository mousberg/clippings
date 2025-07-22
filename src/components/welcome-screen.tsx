"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Search,
  Globe,
  MapPin,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { Client } from "@/types";

interface WelcomeScreenProps {
  clients: Client[];
  onClientSelect: (clientId: string, includeInternational: boolean) => void;
}

export function WelcomeScreen({ clients, onClientSelect }: WelcomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [includeInternational, setIncludeInternational] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredClients = clients.filter(client => 
    client.isActive && 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientSelect = async (clientId: string) => {
    setIsGenerating(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onClientSelect(clientId, includeInternational);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <div className="container mx-auto py-10 px-4 max-w-2xl flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="flex-none mb-10 text-center">
          <div className="mb-6">
            <Image 
              src="/clippings-logo.svg" 
              alt="Clippings" 
              width={126}
              height={126}
              className="mx-auto mb-4"
            />
          </div>
          <h1 className="text-[28px] font-normal text-gray-900 mb-2" 
              style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            Which client needs a report?
          </h1>
          <p className="text-gray-600 text-sm">
            Search for a client and generate their media coverage report
          </p>
        </div>
        
        {/* Main Interface */}
        <div className="max-w-lg mx-auto w-full">
          <div className={`bg-white rounded-[28px] border shadow-[0_10px_20px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300 ${
            searchQuery 
              ? 'border-blue-200 shadow-[0_10px_20px_rgba(59,130,246,0.15)]' 
              : 'border-[rgba(13,13,13,0.05)]'
          }`}>
            
            {/* Search Input */}
            <div className="p-6 pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Client name or search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border-0 bg-transparent focus:ring-0 focus:outline-none text-lg"
                  style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                />
              </div>
              
              {/* International Toggle */}
              <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-2xl border">
                <div className="flex items-center gap-3">
                  {includeInternational ? (
                    <Globe className="h-5 w-5 text-green-600" />
                  ) : (
                    <MapPin className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <div className="font-medium text-sm">
                      {includeInternational ? "International Coverage" : "UK Coverage Only"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {includeInternational 
                        ? "Global sources included"
                        : "UK sources only"
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

            {/* Client Results */}
            {searchQuery && (
              <div className="border-t border-gray-100">
                <div className="max-h-64 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    filteredClients.slice(0, 5).map((client) => (
                      <button
                        key={client.id}
                        onClick={() => handleClientSelect(client.id)}
                        disabled={isGenerating}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0 flex items-center justify-between group transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.industry}</div>
                        </div>
                        {isGenerating ? (
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      <div className="text-sm">No clients found</div>
                      <div className="text-xs">Try adjusting your search</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!searchQuery && (
              <div className="px-6 pb-6 text-center">
                <div className="py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    Start typing to search for a client
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Popular Clients Quick Access */}
          <div className="mt-8">
            <p className="text-center text-gray-500 text-sm mb-4">Popular clients</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {clients.slice(0, 4).map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client.id)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {client.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-2">
              <p className="text-sm text-gray-500">Powered by</p>
              <Image 
                src="/Google_Gemini_logo.svg" 
                alt="Google Gemini" 
                width={60}
                height={22}
                className="object-contain"
                style={{ marginBottom: '2px' }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}