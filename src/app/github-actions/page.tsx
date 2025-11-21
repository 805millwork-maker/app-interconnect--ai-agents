"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, GitBranch, CheckCircle2, XCircle, Clock, Play, Download, Code, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
};

type BuildStatus = {
  id: string;
  workflow: string;
  status: "success" | "failed" | "running" | "pending";
  branch: string;
  commit: string;
  timestamp: Date;
  duration?: number;
};

const templates: WorkflowTemplate[] = [
  {
    id: "nextjs-deploy",
    name: "Next.js CI/CD",
    description: "Build and deploy Next.js app to Vercel",
    category: "deployment",
    code: `name: Next.js CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Run tests
        run: npm test`
  },
  {
    id: "python-test",
    name: "Python Testing",
    description: "Run pytest and code coverage",
    category: "testing",
    code: `name: Python Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install pytest pytest-cov
          pip install -r requirements.txt
      - name: Run tests
        run: pytest --cov=./ --cov-report=xml`
  },
  {
    id: "solidity-audit",
    name: "Smart Contract Audit",
    description: "Security checks for Solidity contracts",
    category: "security",
    code: `name: Smart Contract Security

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install Slither
        run: pip3 install slither-analyzer
      - name: Run security analysis
        run: slither . --exclude-dependencies`
  },
  {
    id: "rust-build",
    name: "Rust Build & Test",
    description: "Compile and test Rust projects",
    category: "testing",
    code: `name: Rust CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - name: Build
        run: cargo build --release
      - name: Run tests
        run: cargo test`
  },
  {
    id: "docker-build",
    name: "Docker Build & Push",
    description: "Build Docker image and push to registry",
    category: "deployment",
    code: `name: Docker Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t myapp:latest .
      - name: Push to registry
        run: docker push myapp:latest`
  },
  {
    id: "lint-format",
    name: "Lint & Format",
    description: "Code quality checks with ESLint and Prettier",
    category: "quality",
    code: `name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npm run lint
      - name: Check formatting
        run: npm run format:check`
  }
];

export default function GitHubActionsPage() {
  const [builds, setBuilds] = useState<BuildStatus[]>([
    {
      id: "1",
      workflow: "Next.js CI/CD",
      status: "success",
      branch: "main",
      commit: "abc123f",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      duration: 145
    },
    {
      id: "2",
      workflow: "Python Tests",
      status: "running",
      branch: "feature/auth",
      commit: "def456a",
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: "3",
      workflow: "Smart Contract Audit",
      status: "failed",
      branch: "main",
      commit: "ghi789b",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      duration: 89
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "deployment", "testing", "security", "quality"];

  const filteredTemplates = activeCategory === "all"
    ? templates
    : templates.filter(t => t.category === activeCategory);

  const getStatusIcon = (status: BuildStatus["status"]) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "failed": return <XCircle className="w-5 h-5 text-red-600" />;
      case "running": return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case "pending": return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: BuildStatus["status"]) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-700 border-green-200";
      case "failed": return "bg-red-500/10 text-red-700 border-red-200";
      case "running": return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "pending": return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
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
                <h1 className="text-2xl font-bold">GitHub Actions</h1>
                <p className="text-sm text-muted-foreground">CI/CD Pipeline Management</p>
              </div>
            </div>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Config
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="templates">Workflow Templates</TabsTrigger>
            <TabsTrigger value="monitoring">Build Monitoring</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <GitBranch className="w-8 h-8 text-primary" />
                      <Badge variant="secondary" className="capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" onClick={() => setSelectedTemplate(template)}>
                          <Code className="w-4 h-4 mr-2" />
                          View Template
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>{template.name}</DialogTitle>
                          <DialogDescription>{template.description}</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                          <pre className="text-sm">
                            <code>{template.code}</code>
                          </pre>
                        </ScrollArea>
                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download YAML
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Copy to Clipboard
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Total Runs</div>
                <div className="text-3xl font-bold">{builds.length}</div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((builds.filter(b => b.status === "success").length / builds.length) * 100)}%
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Running</div>
                <div className="text-3xl font-bold text-blue-600">
                  {builds.filter(b => b.status === "running").length}
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-1">Failed</div>
                <div className="text-3xl font-bold text-red-600">
                  {builds.filter(b => b.status === "failed").length}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Builds</h2>
                <Button size="sm" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Trigger Build
                </Button>
              </div>

              {builds.map((build, index) => (
                <motion.div
                  key={build.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`p-6 border-2 ${getStatusColor(build.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {getStatusIcon(build.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{build.workflow}</h3>
                            <Badge variant="outline" className="text-xs">
                              {build.branch}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Commit: {build.commit}</span>
                            <span>•</span>
                            <span>{build.timestamp.toLocaleTimeString()}</span>
                            {build.duration && (
                              <>
                                <span>•</span>
                                <span>{build.duration}s</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Logs
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}