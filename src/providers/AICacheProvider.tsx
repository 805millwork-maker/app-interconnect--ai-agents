"use client";

import { createContext, useContext, ReactNode } from 'react';
import { AICache } from '@/lib/ai-cache/engine';

interface AICacheContextValue {
  getResponse: (agent: string, prompt: string) => Promise<{ response: string; cached: boolean }>;
  getStats: () => any;
  clear: () => void;
}

const AICacheContext = createContext<AICacheContextValue | null>(null);

export function AICacheProvider({ children }: { children: ReactNode }) {
  const getResponse = async (agent: string, prompt: string) => {
    // Check cache first
    const cached = AICache.getForAgent(agent, prompt);
    if (cached) {
      return { response: cached, cached: true };
    }

    // If not cached, call API
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, prompt }),
      });

      const data = await res.json();
      return { response: data.response, cached: data.cached || false };
    } catch (error) {
      console.error('AI response error:', error);
      return { response: 'Error fetching response', cached: false };
    }
  };

  const getStats = () => AICache.getStats();
  const clear = () => AICache.clear();

  return (
    <AICacheContext.Provider value={{ getResponse, getStats, clear }}>
      {children}
    </AICacheContext.Provider>
  );
}

export function useAICache() {
  const context = useContext(AICacheContext);
  if (!context) {
    throw new Error('useAICache must be used within AICacheProvider');
  }
  return context;
}
