import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Agent from '@/lib/models/Agent';
import Analytics from '@/lib/models/Analytics';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const agent = await Agent.findById(id).populate('author', 'name');
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    // Log view
    try {
      await Analytics.create({
        assetId: agent._id,
        assetType: 'agent',
        eventType: 'view',
        ip: req.headers.get('x-forwarded-for') || 'anonymous'
      });
    } catch (err) {
      console.error('Analytics logging failed:', err);
    }

    return NextResponse.json({ status: 'success', data: { agent } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
