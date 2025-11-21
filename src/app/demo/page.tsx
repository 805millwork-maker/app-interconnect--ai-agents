"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAgentPanel from "@/components/AIAgentPanel";
import { ArrowLeft, Network, MessageSquare, Activity, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type ConnectionEvent = {
  id: string;
  type: "connected" | "message" | "state-update";
  source: string;
  target?: string;
  data?: any;
  timestamp: Date;
};

export default function DemoPage() {
  const [events, setEvents] = useState<ConnectionEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");
  const [activeApps, setActiveApps] = useState<string[]>([]);

  useEffect(() => {
    // Simulate connection establishment
    const timer = setTimeout(() => {
      setConnectionStatus("connected");
      setActiveApps(["App A", "App B", "App C"]);
      
      addEvent({
        id: "1",
        type: "connected",
        source: "Hub",
        data: { message: "Communication hub initialized" },
        timestamp: new Date(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addEvent = (event: ConnectionEvent) => {
    setEvents(prev => [event, ...prev].slice(0, 20));
  };

  const simulateMessage = () => {
    const sources = activeApps;
    const targets = activeApps;
    const source = sources[Math.floor(Math.random() * sources.length)];
    const target = targets.filter(t => t !== source)[Math.floor(Math.random() * (targets.length - 1))];

    addEvent({
      id: Date.now().toString(),
      type: "message",
      source,
      target,
      data: { payload: "Sample data transfer" },
      timestamp: new Date(),
    });
  };

  const simulateStateUpdate = () => {
    const sources = activeApps;
    const source = sources[Math.floor(Math.random() * sources.length)];

    addEvent({
      id: Date.now().toString(),
      type: "state-update",
      source,
      data: { key: "user.preferences", value: { theme: "dark" } },
      timestamp: new Date(),
    });
  };

  const getEventIcon = (type: ConnectionEvent["type"]) => {
    switch (type) {
      case "connected": return Network;
      case "message": return MessageSquare;
      case "state-update": return Activity;
    }
  };

  const getEventColor = (type: ConnectionEvent["type"]) => {
    switch (type) {
      case "connected": return "text-green-600 bg-green-500/10";
      case "message": return "text-blue-600 bg-blue-500/10";
      case "state-update": return "text-purple-600 bg-purple-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Live Demo</h1>
              <p className="text-sm text-muted-foreground">See all features in action</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="communication">Inter-App Comm</TabsTrigger>
            <TabsTrigger value="integration">Full Integration</TabsTrigger>
          </TabsList>

          {/* AI Agents Tab */}
          <TabsContent value="agents">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">AI Code Agents</h2>
                <p className="text-muted-foreground">
                  Interact with specialized AI agents for different programming languages
                </p>
              </div>
              <AIAgentPanel />
            </div>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${connectionStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  <div className="text-sm font-medium">Connection Status</div>
                </div>
                <div className="text-2xl font-bold capitalize">{connectionStatus}</div>
              </Card>
              
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Active Apps</div>
                <div className="text-2xl font-bold">{activeApps.length}</div>
              </Card>
              
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Events</div>
                <div className="text-2xl font-bold">{events.length}</div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Simulate Communication</h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={simulateMessage} disabled={connectionStatus !== "connected"}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={simulateStateUpdate} disabled={connectionStatus !== "connected"}>
                    <Activity className="w-4 h-4 mr-2" />
                    Update State
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Network className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No events yet. Click the buttons above to simulate communication.</p>
                  </div>
                ) : (
                  events.map((event, index) => {
                    const Icon = getEventIcon(event.type);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventColor(event.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {event.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {event.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <strong>{event.source}</strong>
                            {event.target && (
                              <>
                                <span className="text-muted-foreground"> → </span>
                                <strong>{event.target}</strong>
                              </>
                            )}
                          </div>
                          {event.data && (
                            <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                              {JSON.stringify(event.data, null, 2)}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">App Marketplace</h3>
                    <p className="text-sm text-muted-foreground">Slot-based app management</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Dynamic slot allocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Real-time status monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>API endpoint configuration</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/apps">Open Marketplace</Link>
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">GitHub Actions</h3>
                    <p className="text-sm text-muted-foreground">CI/CD pipeline management</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Pre-built workflow templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Real-time build monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span>Multi-language support</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/github-actions">View Workflows</Link>
                </Button>
              </Card>

              <Card className="p-6 md:col-span-2">
                <h3 className="font-semibold mb-4">Technology Stack</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Next.js 15</Badge>
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Tailwind CSS</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Communication</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">WebSocket</Badge>
                      <Badge variant="secondary">API Gateway</Badge>
                      <Badge variant="secondary">Event Bus</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">AI Integration</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Multi-Agent</Badge>
                      <Badge variant="secondary">Code Analysis</Badge>
                      <Badge variant="secondary">Smart Suggestions</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
