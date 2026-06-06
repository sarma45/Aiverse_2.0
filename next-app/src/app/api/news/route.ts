import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import News from '@/lib/models/News';
import { fetchWithCache } from '@/lib/cache';

export async function GET() {
  try {
    await dbConnect();
    
    const news = await fetchWithCache('news-feed:latest', async () => {
      return await News.find().sort('-publishedAt').limit(20);
    }, 300); // 5 minute TTL

    return NextResponse.json({ status: 'success', data: { news } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
