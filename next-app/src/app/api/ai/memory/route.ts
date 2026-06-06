import { NextResponse } from 'next/server';
import { queryAgentMemory, storeAgentMemory } from '@/lib/services/ragService';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');
    const query = searchParams.get('query');

    if (!agentId || !query) {
      return NextResponse.json({ error: 'agentId and query are required' }, { status: 400 });
    }

    const memories = await queryAgentMemory(agentId, query);
    return NextResponse.json({ memories });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const { agentId, content, metadata } = body;

    if (!agentId || !content) {
      return NextResponse.json({ error: 'agentId and content are required' }, { status: 400 });
    }

    await storeAgentMemory(decoded.id, agentId, content, metadata);

    return NextResponse.json({ status: 'success', message: 'Memory encoded' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
