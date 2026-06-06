import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Dataset from '@/lib/models/Dataset';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const dataset = await Dataset.findById(id).populate('author', 'name');
    if (!dataset) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });

    return NextResponse.json({ status: 'success', data: { dataset } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
