import { generateEmbedding, queryVectors, upsertVector } from './vectorService';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function storeAgentMemory(userId: string, agentId: string, content: string, metadata: any = {}) {
  const textToEmbed = `Memory from User ${userId} for Agent ${agentId}: ${content}`;
  const embedding = await generateEmbedding(textToEmbed);
  
  await upsertVector(`mem_${Date.now()}`, embedding, {
    ...metadata,
    userId,
    agentId,
    type: 'memory',
    timestamp: new Date().toISOString()
  });
}

export async function queryAgentMemory(agentId: string, query: string, userId?: string, topK: number = 5) {
  const embedding = await generateEmbedding(query);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = { 
    agentId, 
    type: 'memory' 
  };
  
  if (userId) {
    filter.userId = userId;
  }

  const matches = await queryVectors(embedding, topK, filter);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return matches.map(m => (m.metadata as any)?.content || (m.metadata as any)?.text || "");
}
