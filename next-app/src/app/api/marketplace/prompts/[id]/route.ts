import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const prompt = await Prompt.findById(id).populate('author', 'name');
    if (!prompt) return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });

    return NextResponse.json({ status: 'success', data: { prompt } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
