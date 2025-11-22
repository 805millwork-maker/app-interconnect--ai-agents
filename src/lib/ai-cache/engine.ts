// AI Cache Engine with exact, semantic, and prewarm caching

interface CacheValue {
  response: string;
  tokens: number;
  timestamp: number;
  hits: number;
}

interface PrewarmValue {
  response: string;
  agent: string;
  prompt: string;
}

class AICacheEngine {
  private cache = new Map<string, CacheValue>();
  private prewarmRegistry = new Map<string, PrewarmValue>();
  private maxSize = 1000;
  private ttl = 3600000; // 1 hour

  generateKey(agent: string, prompt: string): string {
    return `${agent}:${prompt.toLowerCase().trim().slice(0, 200)}`;
  }

  get(agent: string, prompt: string): string | null {
    const key = this.generateKey(agent, prompt);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check TTL
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Update hits
    cached.hits++;
    return cached.response;
  }

  set(agent: string, prompt: string, response: string, tokens: number): void {
    const key = this.generateKey(agent, prompt);
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      response,
      tokens,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  prewarm(agent: string, prompt: string, response: string): void {
    const key = this.generateKey(agent, prompt);
    this.prewarmRegistry.set(key, { response, agent, prompt });
  }

  getPrewarmed(agent: string, prompt: string): string | null {
    const key = this.generateKey(agent, prompt);
    return this.prewarmRegistry.get(key)?.response || null;
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      totalHits: entries.reduce((sum, e) => sum + e.hits, 0),
      totalTokensSaved: entries.reduce((sum, e) => sum + e.tokens * e.hits, 0),
      prewarmCount: this.prewarmRegistry.size,
    };
  }

  clear(): void {
    this.cache.clear();
  }

  // Session-based cache
  getForAgent(agent: string, prompt: string): string | null {
    // Check prewarm first (0ms)
    const prewarm = this.getPrewarmed(agent, prompt);
    if (prewarm) return prewarm;

    // Check exact cache
    return this.get(agent, prompt);
  }

  setAgentResponse(agent: string, prompt: string, response: string): void {
    this.set(agent, prompt, response, 150); // Approximate tokens
  }
}

export const AICache = new AICacheEngine();

// Initialize with common prewarmed responses
AICache.prewarm('js-master', 'create react component', 
  `import { useState } from 'react';

export const Component = () => {
  const [state, setState] = useState('');
  
  return (
    <div className="p-4">
      <h1>Component</h1>
    </div>
  );
};`);

AICache.prewarm('python-pro', 'create fastapi endpoint',
  `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}`);

AICache.prewarm('solidity-auditor', 'create basic contract',
  `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasicContract {
    uint256 public value;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
}`);
