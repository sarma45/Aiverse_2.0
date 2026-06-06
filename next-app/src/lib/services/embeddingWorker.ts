import { Worker } from 'bullmq';
import { redis } from '../redis';
import { generateEmbedding, upsertVector } from './vectorService';

export const setupEmbeddingWorker = () => {
  const worker = new Worker('embedding-generation', async (job) => {
    const { assetId, textToEmbed, metadata } = job.data;
    
    if (process.env.PINECONE_API_KEY) {
      try {
        const embedding = await generateEmbedding(textToEmbed);
        await upsertVector(assetId, embedding, metadata);
        return { success: true };
      } catch (err: unknown) {
        console.error('Failed to generate/upsert embedding:', err);
        throw err;
      }
    } else {
      console.warn('Pinecone API key not set, skipping embedding generation.');
      return { success: false, reason: 'No API key' };
    }
  }, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connection: redis as any,
  });

  worker.on('completed', (job) => {
    console.log(`Embedding Job ${job.id} completed!`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Embedding Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
};
