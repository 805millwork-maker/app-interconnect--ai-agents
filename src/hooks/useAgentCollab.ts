import { useInterAppCommunication } from './useInterAppCommunication';
import { EXPERT_AGENTS } from '@/types/agent';

export function useAgentCollab() {
  const { sendMessage, broadcast } = useInterAppCommunication('agents', true);

  const handoff = (fromAgent: string, task: string, toAgents: string[]) => {
    toAgents.forEach(to => {
      sendMessage(to, { type: 'handoff', task, from: fromAgent });
    });
  };

  const mergeResponses = (responses: Record<string, string>) => {
    // Merge responses from multiple agents with clear separation
    return Object.entries(responses)
      .map(([agent, resp]) => `// ============ From ${agent} ============\n${resp}`)
      .join('\n\n');
  };

  const requestCollaboration = (task: string, requiredAgents: string[]) => {
    broadcast({
      type: 'collab-request',
      task,
      requiredAgents,
      timestamp: Date.now(),
    });
  };

  return { handoff, mergeResponses, requestCollaboration };
}
