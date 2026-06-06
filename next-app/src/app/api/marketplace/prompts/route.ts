import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Prompt from '@/lib/models/Prompt';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const prompts = await Prompt.find(query).populate('author', 'name').sort('-createdAt');
    return NextResponse.json({ status: 'success', data: { prompts } });
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
    const prompt = await Prompt.create({
      ...body,
      author: decoded.id
    });

    return NextResponse.json({ status: 'success', data: { prompt } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
