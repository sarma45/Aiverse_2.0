import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/lib/models/Job';
import { JobSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (category) query.category = category;

    const jobs = await Job.find(query).sort('-createdAt');
    return NextResponse.json({ status: 'success', data: { jobs } });
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
    const result = JobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const job = await Job.create({
      ...result.data,
      postedBy: decoded.id
    });

    return NextResponse.json({ status: 'success', data: { job } }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
