import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AiModel from '@/lib/models/AiModel';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const model = await AiModel.findById(id);
    if (!model) return NextResponse.json({ error: 'Model not found' }, { status: 404 });

    return NextResponse.json({ status: 'success', data: { model } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
