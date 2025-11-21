"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings, Trash2, Network, ArrowLeft, Power, Link2, Cpu, Database } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type App = {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "inactive";
  connections: number;
  apiEndpoint?: string;
};

type AppSlot = {
  id: string;
  app: App | null;
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
    type: "web-app",
    apiEndpoint: "",
  });

  const appTypes = [
    { value: "web-app", label: "Web Application" },
    { value: "api", label: "API Service" },
    { value: "database", label: "Database" },
    { value: "analytics", label: "Analytics" },
    { value: "ai-service", label: "AI Service" },
    { value: "storage", label: "Storage" },
  ];

  const handleAddApp = () => {
    if (selectedSlotId && newApp.name) {
      const app: App = {
        id: Date.now().toString(),
        name: newApp.name,
        description: newApp.description,
        type: newApp.type,
        status: "active",
        connections: 0,
        apiEndpoint: newApp.apiEndpoint,
      };

      setSlots(slots.map(slot => 
        slot.id === selectedSlotId ? { ...slot, app } : slot
      ));

      setIsAddDialogOpen(false);
      setNewApp({ name: "", description: "", type: "web-app", apiEndpoint: "" });
      setSelectedSlotId(null);
    }
  };

  const handleRemoveApp = (slotId: string) => {
    setSlots(slots.map(slot => 
      slot.id === slotId ? { ...slot, app: null } : slot
    ));
  };

  const handleToggleStatus = (slotId: string) => {
    setSlots(slots.map(slot => {
      if (slot.id === slotId && slot.app) {
        return {
          ...slot,
          app: {
            ...slot.app,
            status: slot.app.status === "active" ? "inactive" : "active"
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
  };

  const openAddDialog = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsAddDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api": return Link2;
      case "database": return Database;
      case "ai-service": return Cpu;
      default: return Network;
    }
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
                <h1 className="text-2xl font-bold">App Marketplace</h1>
                <p className="text-sm text-muted-foreground">Manage your app integration slots</p>
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        slot.app.status === "active" ? "bg-green-500/10" : "bg-gray-500/10"
                      }`}>
                        {(() => {
                          const Icon = getTypeIcon(slot.app.type);
                          return <Icon className={`w-5 h-5 ${
                            slot.app.status === "active" ? "text-green-600" : "text-gray-600"
                          }`} />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{slot.app.name}</h3>
                        <Badge variant={slot.app.status === "active" ? "default" : "secondary"} className="mt-1">
                          {slot.app.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {slot.app.description || "No description provided"}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{slot.app.type.replace("-", " ")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Connections:</span>
                      <span className="font-medium">{slot.app.connections}</span>
                    </div>
                    {slot.app.apiEndpoint && (
                      <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                        {slot.app.apiEndpoint}
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
                      Click to add an app to this slot
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New App</DialogTitle>
            <DialogDescription>
              Configure your app integration. Click save when you're done.
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
            <div className="grid gap-2">
              <Label htmlFor="type">App Type</Label>
              <Select
                value={newApp.type}
                onValueChange={(value) => setNewApp({ ...newApp, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select app type" />
                </SelectTrigger>
                <SelectContent>
                  {appTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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