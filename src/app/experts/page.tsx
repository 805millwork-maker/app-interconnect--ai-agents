"use client";

import { useState, useEffect } from 'react';
import { EXPERT_AGENTS } from '@/types/agent';
import { useInterAppCommunication } from '@/hooks/useInterAppCommunication';
import { useAICache } from '@/providers/AICacheProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Zap, Network, Code, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function ExpertsPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('integrator');
  const [collabLog, setCollabLog] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cacheStats, setCacheStats] = useState({ hits: 0, savings: 0 });
  
  const { sendMessage, broadcast, status } = useInterAppCommunication('experts', true);
  const { getResponse, getStats } = useAICache();

  const handleConsult = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    const agent = EXPERT_AGENTS.find(a => a.id === selectedAgent)!;
    setIsLoading(true);
    setResponse('');

    try {
      const { response: aiResponse, cached } = await getResponse(agent.id, query);
      
      setResponse(aiResponse);
      
      if (cached) {
        toast.success(`${agent.name}: ⚡ Instant from cache!`);
      } else {
        toast.success(`${agent.name}: Generated!`);
      }

      // Check for collaboration needs
      if (agent.abilities.includes('handoff') && query.toLowerCase().includes('multi')) {
        broadcast({ 
          type: 'handoff', 
          query, 
          from: agent.id, 
          to: ['python-pro', 'solidity-auditor', 'js-master'] 
        });
        setCollabLog(prev => [...prev, `${agent.name} requested collaboration from specialists...`]);
      }

      // Update cache stats
      const stats = getStats();
      setCacheStats({ 
        hits: stats.totalHits, 
        savings: Math.round(stats.totalTokensSaved / 1000) 
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedAgentData = EXPERT_AGENTS.find(a => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Expert Agent Panel</h1>
                <p className="text-sm text-muted-foreground">
                  Consult specialists with AI caching & intelligent routing
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Zap className="w-3 h-3" />
                {cacheStats.hits} cache hits
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Network className={status === 'connected' ? 'text-green-500' : 'text-gray-500'} />
                {status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Agent Selection */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Select Expert</h3>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Expert" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERT_AGENTS.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedAgentData && (
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Specialty</div>
                    <Badge>{selectedAgentData.specialty}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Topic</div>
                    <Badge variant="outline">{selectedAgentData.topic}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Abilities</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedAgentData.abilities.map(ability => (
                        <Badge key={ability} variant="secondary" className="text-xs">
                          {ability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Cache Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cache Hits:</span>
                  <span className="font-medium">{cacheStats.hits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens Saved:</span>
                  <span className="font-medium">{cacheStats.savings}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WebSim Status:</span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Query & Response */}
          <div className="lg:col-span-2 space-y-4">
            {/* Query Input */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Your Query</h3>
              <div className="space-y-3">
                <Input
                  placeholder="e.g., 'Build React UI calling Python API with Solidity backend'"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleConsult()}
                  className="w-full"
                />
                <Button 
                  onClick={handleConsult} 
                  disabled={status !== 'connected' || isLoading || !query.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Code className="w-4 h-4 mr-2 animate-spin" />
                      Consulting Expert...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Consult Expert
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Response */}
            {response && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Response</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-1 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-x-auto font-mono">
                  {response}
                </pre>
              </Card>
            )}

            {/* Collaboration Log */}
            {collabLog.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Collaboration Log
                </h3>
                <ul className="space-y-2">
                  {collabLog.map((log, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {log}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Deploy Action */}
            <Card className="p-6 border-dashed">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Deploy as Multi-Lang App</h3>
                  <p className="text-sm text-muted-foreground">
                    Add generated code to app marketplace
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast.success('Feature coming soon!');
                  }}
                  disabled={!response}
                >
                  Deploy
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
