import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/lib/models/Tool';
import { ToolSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/authUtils';
import { generateEmbedding, queryVectors } from '@/lib/services/vectorService';
import { autoTagResource } from '@/lib/services/intelligenceService';
import { addEmbeddingJob } from '@/lib/services/embeddingQueue';
import { fetchWithCache } from '@/lib/cache';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    if (search && process.env.PINECONE_API_KEY) {
      try {
        const embedding = await generateEmbedding(search);
        const matches = await queryVectors(embedding, 12);

        const toolIds = matches.map(m => m.id);
        const tools = await Tool.find({ _id: { $in: toolIds } });

        // Re-sort tools based on Pinecone score order
        const sortedTools = toolIds.map(id => tools.find(t => t._id.toString() === id)).filter(Boolean);

        return NextResponse.json({ status: 'success', data: { tools: sortedTools, searchType: 'semantic' } });
      } catch (err) {
        console.error('Semantic search failed, falling back to regex:', err);
      }
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      const tools = await Tool.find(query).sort('-isFeatured -createdAt');
      return NextResponse.json({ status: 'success', data: { tools, searchType: 'keyword' } });
    }

    const tools = await fetchWithCache('tools:directory', async () => {
      return await Tool.find({}).sort('-isFeatured -createdAt').lean();
    }, 120);

    return NextResponse.json({ status: 'success', data: { tools, searchType: 'keyword' } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Auth Check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const result = ToolSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    // Auto-Tagging
    let finalTags = result.data.tags || [];
    if (finalTags.length === 0) {
      try {
        finalTags = await autoTagResource(result.data.name, result.data.description, 'tool');
      } catch (err) {
        console.error('Auto-tagging failed during tool creation:', err);
      }
    }

    const tool = await Tool.create({
      ...result.data,
      tags: finalTags,
      author: decoded.id
    });

    // Vectorize for Semantic Search
    try {
      if (process.env.PINECONE_API_KEY && process.env.REDIS_URL) {
        const textToEmbed = `${tool.name}: ${tool.description}. Category: ${tool.category}. Features: ${tool.features?.join(', ')}. Tags: ${tool.tags?.join(', ')}`;
        await addEmbeddingJob(tool._id.toString(), textToEmbed, {
          name: tool.name,
          category: tool.category,
          type: 'tool'
        });
      }
    } catch (err) {
      console.error('Failed to queue embedding job:', err);
    }

    return NextResponse.json({ status: 'success', data: { tool } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
