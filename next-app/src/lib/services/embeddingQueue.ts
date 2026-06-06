import { Queue } from 'bullmq';
import { redis } from '../redis';

export const embeddingQueue = new Queue('embedding-generation', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connection: redis as any,
});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addEmbeddingJob(assetId: string, textToEmbed: string, metadata: any) {
  return await embeddingQueue.add('generate', {
    assetId,
    textToEmbed,
    metadata,
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}
