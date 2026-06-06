import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workflow from '@/lib/models/Workflow';
import { addWorkflowJob } from '@/lib/services/workflowQueue';
import { getCurrentUser } from '@/lib/authUtils';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Auth Check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = await params;
    const body = await req.json();
    const { input } = body;

    const workflow = await Workflow.findById(id);
    if (!workflow) return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });

    const job = await addWorkflowJob(id, input, decoded.id);

    return NextResponse.json({ 
      status: 'queued', 
      data: { 
        jobId: job.id,
        message: 'Workflow execution started in background' 
      } 
    }, { status: 202 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
