import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

export async function generateEmbedding(text: string) {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertVector(id: string, values: number[], metadata: any) {
  const index = pc.index(process.env.PINECONE_INDEX!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (index as any).upsert([{ id, values, metadata }]);
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryVectors(vector: number[], topK: number = 10, filter: any = {}) {
  const index = pc.index(process.env.PINECONE_INDEX!);
  const result = await index.query({
    vector,
    topK,
    filter,
    includeMetadata: true,
  });
  return result.matches;
}
