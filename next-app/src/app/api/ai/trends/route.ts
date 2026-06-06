import { NextResponse } from 'next/server';
import { detectAiTrends } from '@/lib/services/intelligenceService';

export async function GET() {
  try {
    const trends = await detectAiTrends();
    return NextResponse.json({ status: 'success', data: { trends } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
