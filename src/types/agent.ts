export interface ExpertAgent {
  id: string;
  name: string;
  specialty: string;
  topic: string;
  abilities: string[];
  color?: string;
}

export const EXPERT_AGENTS: ExpertAgent[] = [
  { 
    id: 'integrator', 
    name: 'Code Integrator', 
    specialty: 'cross-lang', 
    topic: 'general', 
    abilities: ['handoff', 'merge'],
    color: 'purple'
  },
  { 
    id: 'js-master', 
    name: 'JS/TS Expert', 
    specialty: 'react-next', 
    topic: 'js-ts', 
    abilities: ['generate', 'optimize'],
    color: 'yellow'
  },
  { 
    id: 'python-pro', 
    name: 'Python Specialist', 
    specialty: 'fastapi-ml', 
    topic: 'python', 
    abilities: ['api', 'data'],
    color: 'blue'
  },
  { 
    id: 'solidity-auditor', 
    name: 'Solidity Auditor', 
    specialty: 'smart-contracts', 
    topic: 'solidity', 
    abilities: ['audit', 'deploy'],
    color: 'purple'
  },
  { 
    id: 'rust-engineer', 
    name: 'Rust Engineer', 
    specialty: 'systems-wasm', 
    topic: 'rust', 
    abilities: ['async', 'secure'],
    color: 'orange'
  },
  { 
    id: 'reviewer', 
    name: 'Code Reviewer', 
    specialty: 'multi', 
    topic: 'general', 
    abilities: ['review', 'fix'],
    color: 'green'
  },
];
