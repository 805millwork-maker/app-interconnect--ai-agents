"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, GitBranch, Network, Sparkles, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: Network,
      title: "App Integration Hub",
      description: "Connect multiple apps in a slot-based system to expand capabilities across your entire ecosystem"
    },
    {
      icon: Sparkles,
      title: "AI Code Agents",
      description: "Expert AI agents for JavaScript, Python, Solidity, Rust, HTML, CSS - analyze, improve, and generate code"
    },
    {
      icon: GitBranch,
      title: "GitHub Actions",
      description: "Configure CI/CD pipelines with pre-built templates and monitor build status in real-time"
    },
    {
      icon: Zap,
      title: "Real-time Communication",
      description: "WebSocket-based inter-app messaging with shared state management and API gateway"
    },
    {
      icon: Shield,
      title: "Secure & Scalable",
      description: "Enterprise-grade security with horizontal scaling support for growing communities"
    },
    {
      icon: Code2,
      title: "Advanced Tech Stack",
      description: "Built with Next.js 15, TypeScript, WebSockets, and modern AI integration patterns"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-1 rounded-lg flex items-center justify-center">
              <Network className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">AppConnect</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/apps" className="text-sm font-medium hover:text-primary transition-colors">
              Apps
            </Link>
            <Link href="/experts" className="text-sm font-medium hover:text-primary transition-colors">
              Experts
            </Link>
            <Link href="/github-actions" className="text-sm font-medium hover:text-primary transition-colors">
              GitHub Actions
            </Link>
            <Link href="/demo" className="text-sm font-medium hover:text-primary transition-colors">
              Demo
            </Link>
            <Button size="sm" asChild>
              <Link href="/demo">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered App Integration Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Connect, Enhance, Scale
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Unite your applications in a powerful ecosystem with AI agents, automated workflows, 
            and seamless inter-app communication. Build the future of connected software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base">
              <Link href="/apps">
                Explore Apps <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base">
              <Link href="/demo">
                View Demo
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build a connected app ecosystem with AI-powered capabilities
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow border-border/50">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Start</h2>
            <p className="text-muted-foreground text-lg">
              Get up and running in minutes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold mb-2">Add App Slots</h3>
              <p className="text-sm text-muted-foreground">
                Create slots in the marketplace and configure your apps
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold mb-2">Deploy AI Agents</h3>
              <p className="text-sm text-muted-foreground">
                Activate specialized coding agents to assist development
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold mb-2">Connect & Scale</h3>
              <p className="text-sm text-muted-foreground">
                Enable inter-app communication and watch your ecosystem grow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 mb-20">
        <Card className="bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 border-primary/20 p-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Connect Your Apps?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join the community of developers building the next generation of connected applications
            </p>
            <Button size="lg" asChild>
              <Link href="/apps">
                Start Building <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}