import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Comment from '@/lib/models/Comment';
import { getCurrentUser } from '@/lib/authUtils';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const comment = await Comment.create({
      ...body,
      author: decoded.id
    });

    return NextResponse.json({ status: 'success', data: { comment } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
