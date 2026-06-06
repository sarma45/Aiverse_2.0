import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import dbConnect from '@/lib/db';
import Tool from '@/lib/models/Tool';

const RATE_LIMIT_WINDOW = 60; // 1 minute
const MAX_REQUESTS = 10; // Requests per window

export async function GET(req: Request) {
  try {
    // 1. Rate Limiting Logic
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const key = `rate-limit:enterprise:${ip}`;
    
    const requests = await redis.incr(key);
    if (requests === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    if (requests > MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests. Enterprise tier limit reached.' },
        { status: 429 }
      );
    }

    // 2. Business Logic (Example: Bulk fetch verified tools)
    await dbConnect();
    const tools = await Tool.find({ isVerified: true }).limit(50);

    return NextResponse.json({
      status: 'success',
      tier: 'enterprise',
      remaining: MAX_REQUESTS - requests,
      data: { tools }
    });

  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
