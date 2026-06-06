import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizePrompt } from '@/lib/utils/security';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, persona } = body;

    if (!prompt || !persona) {
      return NextResponse.json({ error: 'Prompt and persona are required' }, { status: 400 });
    }

    const sanitizedPrompt = sanitizePrompt(prompt);
    const fullPrompt = `Act as the following persona: ${persona}. Respond to this input:\n\n${sanitizedPrompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const content = (await result.response).text();

    return NextResponse.json({ content });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
