import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AiModel from '@/lib/models/AiModel';
import { AiModelSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (category) query.category = category;

    const models = await AiModel.find(query).sort('-avgRating');
    return NextResponse.json({ status: 'success', data: { models } });
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
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

    const body = await req.json();
    const result = AiModelSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const aiModel = await AiModel.create(result.data);
    return NextResponse.json({ status: 'success', data: { model: aiModel } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
