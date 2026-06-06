import { setupWorkflowWorker } from './src/lib/services/workflowWorker';
import { setupEmbeddingWorker } from './src/lib/services/embeddingWorker';
import dotenv from 'dotenv';

// Load environment variables manually since this runs outside Next.js
dotenv.config({ path: '.env.local' });

console.log('Starting AIVerse Background Worker Process...');
const workflowWorker = setupWorkflowWorker();
const embeddingWorker = setupEmbeddingWorker();

process.on('SIGINT', async () => {
  console.log('Shutting down workers gracefully...');
  await workflowWorker.close();
  await embeddingWorker.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down workers gracefully...');
  await workflowWorker.close();
  await embeddingWorker.close();
  process.exit(0);
});
