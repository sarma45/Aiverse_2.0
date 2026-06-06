import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizePrompt } from '@/lib/utils/security';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const sanitizedText = sanitizePrompt(text);
    const prompt = `Summarize the following content into a concise, professional summary:\n\n${sanitizedText}`;
    
    const result = await model.generateContent(prompt);
    const summary = (await result.response).text();

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
