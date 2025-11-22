"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft, Power, Link2, Cpu, Database, Code2, Globe, FileCode } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MultiLangApp } from "@/types/app";
import { useInterAppCommunication } from "@/hooks/useInterAppCommunication";
import { toast } from "sonner";

type AppSlot = {
  id: string;
  app: MultiLangApp | null;
};

export default function AppsPage() {
  const [slots, setSlots] = useState<AppSlot[]>([
    { id: "1", app: null },
    { id: "2", app: null },
    { id: "3", app: null },
    { id: "4", app: null },
    { id: "5", app: null },
    { id: "6", app: null },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [newApp, setNewApp] = useState({
    name: "",
    description: "",
    lang: "js-ts" as MultiLangApp['lang'],
    format: "web" as MultiLangApp['format'],
    runtime: "node" as MultiLangApp['runtime'],
    code: "",
    apiEndpoint: "",
  });

  const { sendMessage } = useInterAppCommunication('apps', true);

  const appLanguages = [
    { value: "js-ts", label: "JavaScript/TypeScript", icon: Code2 },
    { value: "python", label: "Python", icon: FileCode },
    { value: "rust", label: "Rust", icon: Cpu },
    { value: "solidity", label: "Solidity", icon: Database },
    { value: "html-css", label: "HTML/CSS", icon: Globe },
  ];

  const appFormats = [
    { value: "web", label: "Web Application" },
    { value: "api", label: "API Service" },
    { value: "contract", label: "Smart Contract" },
    { value: "binary", label: "Binary/Native" },
  ];

  const appRuntimes = [
    { value: "node", label: "Node.js" },
    { value: "docker", label: "Docker Container" },
    { value: "wasm", label: "WebAssembly" },
  ];

  const handleAddApp = () => {
    if (selectedSlotId && newApp.name) {
      const app: MultiLangApp = {
        id: Date.now().toString(),
        name: newApp.name,
        description: newApp.description,
        lang: newApp.lang,
        format: newApp.format,
        runtime: newApp.runtime,
        code: newApp.code || `// Generated ${newApp.lang} code\nconsole.log("Hello from ${newApp.name}");`,
        endpoint: `/slots/${Date.now()}`,
        status: "active",
        connections: 0,
      };

      setSlots(slots.map(slot => 
        slot.id === selectedSlotId ? { ...slot, app } : slot
      ));

      // Broadcast to other apps
      sendMessage('all', { type: 'app-added', slot: app, integrate: true });
      toast.success(`${newApp.name} added successfully!`);

      setIsAddDialogOpen(false);
      setNewApp({ 
        name: "", 
        description: "", 
        lang: "js-ts", 
        format: "web", 
        runtime: "node",
        code: "",
        apiEndpoint: "" 
      });
      setSelectedSlotId(null);
    }
  };

  const handleRemoveApp = (slotId: string) => {
    setSlots(slots.map(slot => 
      slot.id === slotId ? { ...slot, app: null } : slot
    ));
    toast.success('App removed');
  };

  const handleToggleStatus = (slotId: string) => {
    setSlots(slots.map(slot => {
      if (slot.id === slotId && slot.app) {
        const newStatus = slot.app.status === "active" ? "inactive" : "active";
        toast.success(`App ${newStatus === "active" ? "activated" : "deactivated"}`);
        return {
          ...slot,
          app: {
            ...slot.app,
            status: newStatus
          }
        };
      }
      return slot;
    }));
  };

  const handleAddSlot = () => {
    const newSlot: AppSlot = {
      id: (slots.length + 1).toString(),
      app: null,
    };
    setSlots([...slots, newSlot]);
    toast.success('New slot added');
  };

  const openAddDialog = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsAddDialogOpen(true);
  };

  const getLanguageIcon = (lang: string) => {
    const langConfig = appLanguages.find(l => l.value === lang);
    return langConfig?.icon || Code2;
  };

  const getLanguageColor = (lang: string) => {
    const colors = {
      'js-ts': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      'python': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      'rust': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      'solidity': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      'html-css': 'bg-green-500/10 text-green-600 dark:text-green-400',
    };
    return colors[lang as keyof typeof colors] || 'bg-gray-500/10 text-gray-600';
  };

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
                <h1 className="text-2xl font-bold">Multi-Language App Marketplace</h1>
                <p className="text-sm text-muted-foreground">Manage apps in JS/TS, Python, Rust, Solidity & more</p>
              </div>
            </div>
            <Button onClick={handleAddSlot}>
              <Plus className="w-4 h-4 mr-2" />
              Add Slot
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Slots</div>
            <div className="text-3xl font-bold">{slots.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Active Apps</div>
            <div className="text-3xl font-bold text-green-600">
              {slots.filter(s => s.app?.status === "active").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Empty Slots</div>
            <div className="text-3xl font-bold text-muted-foreground">
              {slots.filter(s => !s.app).length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Connections</div>
            <div className="text-3xl font-bold text-blue-600">
              {slots.reduce((sum, s) => sum + (s.app?.connections || 0), 0)}
            </div>
          </Card>
        </div>

        {/* App Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot, index) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {slot.app ? (
                <Card className="p-6 h-full border-2 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getLanguageColor(slot.app.lang)}`}>
                        {(() => {
                          const Icon = getLanguageIcon(slot.app.lang);
                          return <Icon className="w-5 h-5" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{slot.app.name}</h3>
                        <div className="flex gap-1 mt-1">
                          <Badge variant={slot.app.status === "active" ? "default" : "secondary"}>
                            {slot.app.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {slot.app.lang.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {slot.app.description || "No description provided"}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium capitalize">{slot.app.format}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Runtime:</span>
                      <span className="font-medium capitalize">{slot.app.runtime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Connections:</span>
                      <span className="font-medium">{slot.app.connections}</span>
                    </div>
                    {slot.app.endpoint && (
                      <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded font-mono">
                        {slot.app.endpoint}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleToggleStatus(slot.id)}
                    >
                      <Power className="w-3 h-3 mr-1" />
                      {slot.app.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveApp(slot.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 h-full border-2 border-dashed hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group"
                  onClick={() => openAddDialog(slot.id)}
                >
                  <div className="flex flex-col items-center justify-center h-full min-h-[240px] text-center">
                    <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                      <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold mb-2">Empty Slot {slot.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Click to add a multi-language app
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add App Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Multi-Language App</DialogTitle>
            <DialogDescription>
              Configure your app with language, runtime, and code integration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">App Name</Label>
              <Input
                id="name"
                placeholder="My Awesome App"
                value={newApp.name}
                onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lang">Language</Label>
                <Select
                  value={newApp.lang}
                  onValueChange={(value) => setNewApp({ ...newApp, lang: value as MultiLangApp['lang'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {appLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={newApp.format}
                  onValueChange={(value) => setNewApp({ ...newApp, format: value as MultiLangApp['format'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {appFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="runtime">Runtime</Label>
              <Select
                value={newApp.runtime}
                onValueChange={(value) => setNewApp({ ...newApp, runtime: value as MultiLangApp['runtime'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select runtime" />
                </SelectTrigger>
                <SelectContent>
                  {appRuntimes.map((runtime) => (
                    <SelectItem key={runtime.value} value={runtime.value}>
                      {runtime.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this app does..."
                value={newApp.description}
                onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="code">Code (Optional)</Label>
              <Textarea
                id="code"
                placeholder="Paste your code here or leave empty for auto-generation..."
                value={newApp.code}
                onChange={(e) => setNewApp({ ...newApp, code: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endpoint">API Endpoint (Optional)</Label>
              <Input
                id="endpoint"
                placeholder="https://api.example.com"
                value={newApp.apiEndpoint}
                onChange={(e) => setNewApp({ ...newApp, apiEndpoint: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddApp} disabled={!newApp.name}>
              Add App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}