"use client";

import { createContext, useContext, ReactNode } from 'react';
import { WebSimRouter, TaskType, Priority } from '@/lib/websim/router';

interface WebSimContextValue {
  call: (agent: string, prompt: string, priority?: Priority) => Promise<{ response: string; model: string; provider: string }>;
  selectModel: (taskType: TaskType, priority: Priority) => any;
}

const WebSimContext = createContext<WebSimContextValue | null>(null);

export function WebSimProvider({ children }: { children: ReactNode }) {
  const call = async (agent: string, prompt: string, priority: Priority = 'medium') => {
    try {
      const res = await fetch('/api/websim/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, prompt, priority }),
      });

      const data = await res.json();
      return {
        response: data.response,
        model: data.model,
        provider: data.provider || 'unknown',
      };
    } catch (error) {
      console.error('WebSim error:', error);
      return {
        response: 'Error calling WebSim',
        model: 'error',
        provider: 'error',
      };
    }
  };

  const selectModel = (taskType: TaskType, priority: Priority) => {
    return WebSimRouter.selectBest('', taskType, priority);
  };

  return (
    <WebSimContext.Provider value={{ call, selectModel }}>
      {children}
    </WebSimContext.Provider>
  );
}

export function useWebSim() {
  const context = useContext(WebSimContext);
  if (!context) {
    throw new Error('useWebSim must be used within WebSimProvider');
  }
  return context;
}
