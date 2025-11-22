// WebSim Intelligent Model Router

interface ModelConfig {
  name: string;
  provider: string;
  costPer1kTokens: number;
  speedRating: number; // 1-10
  qualityRating: number; // 1-10
  specialties: string[];
}

const MODELS: ModelConfig[] = [
  {
    name: 'gpt-4-turbo',
    provider: 'openai',
    costPer1kTokens: 0.01,
    speedRating: 7,
    qualityRating: 9,
    specialties: ['general', 'reasoning', 'code'],
  },
  {
    name: 'claude-3-opus',
    provider: 'anthropic',
    costPer1kTokens: 0.015,
    speedRating: 6,
    qualityRating: 10,
    specialties: ['reasoning', 'creative', 'code'],
  },
  {
    name: 'gpt-3.5-turbo',
    provider: 'openai',
    costPer1kTokens: 0.0015,
    speedRating: 10,
    qualityRating: 7,
    specialties: ['general', 'fast'],
  },
  {
    name: 'mistral-large',
    provider: 'mistral',
    costPer1kTokens: 0.008,
    speedRating: 8,
    qualityRating: 8,
    specialties: ['code', 'multilingual'],
  },
  {
    name: 'codellama-70b',
    provider: 'meta',
    costPer1kTokens: 0.005,
    speedRating: 7,
    qualityRating: 8,
    specialties: ['code', 'python', 'rust'],
  },
];

export type TaskType = 'general' | 'code' | 'reasoning' | 'creative' | 'python' | 'rust' | 'solidity' | 'react' | 'javascript';
export type Priority = 'cost' | 'speed' | 'quality' | 'medium';

class WebSimRouterClass {
  selectBest(prompt: string, taskType: TaskType, priority: Priority): ModelConfig {
    // Filter models by specialty
    let candidates = MODELS;
    
    if (taskType === 'code' || taskType === 'python' || taskType === 'rust' || taskType === 'solidity' || taskType === 'react' || taskType === 'javascript') {
      candidates = MODELS.filter(m => 
        m.specialties.includes('code') || 
        m.specialties.includes(taskType)
      );
    }

    // Score based on priority
    const scored = candidates.map(model => {
      let score = 0;
      
      switch (priority) {
        case 'cost':
          score = 100 / model.costPer1kTokens;
          break;
        case 'speed':
          score = model.speedRating * 10;
          break;
        case 'quality':
          score = model.qualityRating * 10;
          break;
        case 'medium':
          score = (model.speedRating * 4) + (model.qualityRating * 3) + (50 / model.costPer1kTokens);
          break;
      }
      
      return { model, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);
    
    return scored[0].model;
  }

  getModels(): ModelConfig[] {
    return MODELS;
  }

  estimateCost(tokens: number, modelName: string): number {
    const model = MODELS.find(m => m.name === modelName);
    if (!model) return 0;
    return (tokens / 1000) * model.costPer1kTokens;
  }
}

export const WebSimRouter = new WebSimRouterClass();
