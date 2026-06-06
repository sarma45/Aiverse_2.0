import { NextResponse } from 'next/server';
import { workflowQueue } from '@/lib/services/workflowQueue';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) return NextResponse.json({ error: 'Job ID required' }, { status: 400 });

    const job = await workflowQueue.getJob(jobId);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;

    return NextResponse.json({
      status: 'success',
      data: {
        id: job.id,
        state,
        progress,
        result
      }
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
