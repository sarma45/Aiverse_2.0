import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workflow from '@/lib/models/Workflow';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const workflows = await Workflow.find({ isPublic: true }).populate('author', 'name');
    return NextResponse.json({ status: 'success', data: { workflows } });
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
    const workflow = await Workflow.create({
      ...body,
      author: decoded.id
    });

    return NextResponse.json({ status: 'success', data: { workflow } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
