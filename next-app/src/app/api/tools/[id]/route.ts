import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tool from '@/lib/models/Tool';
import Analytics from '@/lib/models/Analytics';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const tool = await Tool.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!tool) return NextResponse.json({ error: 'Tool not found' }, { status: 404 });

    // Log premium time-series analytics
    try {
      await Analytics.create({
        assetId: tool._id,
        assetType: 'tool',
        eventType: 'view',
        ip: req.headers.get('x-forwarded-for') || 'anonymous'
      });
    } catch (err) {
      console.error('Analytics logging failed:', err);
    }

    return NextResponse.json({ status: 'success', data: { tool } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const tool = await Tool.findByIdAndUpdate(id, body, { new: true });
    if (!tool) return NextResponse.json({ error: 'Tool not found' }, { status: 404 });

    return NextResponse.json({ status: 'success', data: { tool } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const tool = await Tool.findByIdAndDelete(id);
    if (!tool) return NextResponse.json({ error: 'Tool not found' }, { status: 404 });

    return NextResponse.json({ status: 'success', data: null });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
