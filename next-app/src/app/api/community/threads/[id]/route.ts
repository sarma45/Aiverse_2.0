import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Thread from '@/lib/models/Thread';
import Comment from '@/lib/models/Comment';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const thread = await Thread.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate('author', 'name');
    if (!thread) return NextResponse.json({ error: 'Thread not found' }, { status: 404 });

    const comments = await Comment.find({ thread: thread._id }).populate('author', 'name').sort('createdAt');

    return NextResponse.json({
      status: 'success',
      data: { thread, comments }
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
