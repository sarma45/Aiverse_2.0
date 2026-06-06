import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Agent from '@/lib/models/Agent';
import { AgentSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/authUtils';
import { generateEmbedding, queryVectors } from '@/lib/services/vectorService';
import { autoTagResource } from '@/lib/services/intelligenceService';
import { addEmbeddingJob } from '@/lib/services/embeddingQueue';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    if (search && process.env.PINECONE_API_KEY) {
      try {
        const embedding = await generateEmbedding(search);
        const matches = await queryVectors(embedding, 12, { type: 'agent' });

        const agentIds = matches.map(m => m.id);
        const agents = await Agent.find({ _id: { $in: agentIds } });
        const sortedAgents = agentIds.map(id => agents.find(a => a._id.toString() === id)).filter(Boolean);

        return NextResponse.json({ status: 'success', data: { agents: sortedAgents, searchType: 'semantic' } });
      } catch (err) {
        console.error('Semantic search failed for agents:', err);
      }
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const agents = await Agent.find(query).sort('-avgRating');
    return NextResponse.json({ status: 'success', data: { agents } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const result = AgentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const agent = await Agent.create({
      ...result.data,
      author: decoded.id
    });

    // Vectorize for Semantic Search
    try {
      if (process.env.PINECONE_API_KEY && process.env.REDIS_URL) {
        const textToEmbed = `${agent.name}: ${agent.description}. Category: ${agent.category}. Instruction: ${agent.systemInstruction}. Capabilities: ${agent.capabilities?.join(', ')}`;
        await addEmbeddingJob(agent._id.toString(), textToEmbed, {
          name: agent.name,
          category: agent.category,
          type: 'agent'
        });
      }
    } catch (err) {
      console.error('Failed to queue agent embedding job:', err);
    }

    return NextResponse.json({ status: 'success', data: { agent } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
