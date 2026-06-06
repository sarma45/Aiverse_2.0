import { NextResponse } from 'next/server';
import { aggregateNews } from '@/lib/services/newsService';
import { getCurrentUser } from '@/lib/authUtils';

export async function POST(req: Request) {
  try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

    await aggregateNews();

    return NextResponse.json({ status: 'success', message: 'News aggregation complete' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
