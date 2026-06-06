import { GoogleGenerativeAI } from '@google/generative-ai';
import dbConnect from '../db';
import News from '../models/News';
import Tool from '../models/Tool';
import Agent from '../models/Agent';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Automatically tags a resource based on its name and description.
 */
export async function autoTagResource(name: string, description: string, type: 'tool' | 'agent') {
  const prompt = `Based on the following ${type} name and description, generate 5-8 relevant tags/keywords for categorization.
  Name: ${name}
  Description: ${description}
  
  Return ONLY a JSON array of strings.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text) as string[];
  } catch (err) {
    console.error('Auto-tagging failed:', err);
    return [];
  }
}

/**
 * Detects trending AI topics based on recent news and popular tools.
 */
export async function detectAiTrends() {
  await dbConnect();
  
  // Fetch recent news titles
  const news = await News.find().sort('-publishedAt').limit(20).select('title');
  const newsTitles = news.map(n => n.title).join('\n');

  const prompt = `Analyze the following recent AI news headlines and identify the top 5 trending topics or technologies.
  Headlines:
  ${newsTitles}
  
  Return ONLY a JSON array of objects with "topic" (string) and "relevance" (number 1-100).`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (err) {
    console.error('Trend detection failed:', err);
    return [];
  }
}
