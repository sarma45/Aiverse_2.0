import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Thread from '@/lib/models/Thread';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (category && category !== 'all') query.category = category;

    const threads = await Thread.find(query).populate('author', 'name').sort('-createdAt');
    return NextResponse.json({ status: 'success', data: { threads } });
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
    const thread = await Thread.create({
      ...body,
      author: decoded.id
    });

    return NextResponse.json({ status: 'success', data: { thread } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
