import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Deployment from '@/lib/models/Deployment';
import Agent from '@/lib/models/Agent';
import { getCurrentUser } from '@/lib/authUtils';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = await params;
    
    const agent = await Agent.findById(id);
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    // Check if user already deployed this agent
    const existing = await Deployment.findOne({ user: decoded.id, agent: id });
    if (existing) {
      return NextResponse.json({ error: 'Agent already deployed to your environment' }, { status: 400 });
    }

    // Generate secure credentials for the deployment
    const apiKey = 'sk_aiverse_' + crypto.randomBytes(24).toString('hex');
    const namespace = `ns_${decoded.id}_${id}`;
    const endpointUrl = `https://api.aiverse.com/v1/deployments/${namespace}/chat`;

    const deployment = await Deployment.create({
      user: decoded.id,
      agent: id,
      apiKey,
      namespace,
      endpointUrl
    });

    return NextResponse.json({ status: 'success', data: { deployment } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
