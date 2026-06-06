import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/lib/models/Collection';
import { fetchWithCache } from '@/lib/cache';

export async function GET() {
  try {
    await dbConnect();
    
    const collections = await fetchWithCache('collections:public', async () => {
      return await Collection.find({ isPublic: true }).populate('tools', 'name category avgRating');
    }, 600); // 10 minute TTL

    return NextResponse.json({ status: 'success', data: { collections } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
