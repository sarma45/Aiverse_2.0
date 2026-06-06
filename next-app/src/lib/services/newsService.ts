import Parser from 'rss-parser';
import dbConnect from '../db';
import News from '../models/News';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizePrompt } from '../utils/security';

const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const RSS_FEEDS = [
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
  'https://www.wired.com/category/backchannel/feed', // Often has AI news
];

export async function aggregateNews() {
  await dbConnect();
  const allItems = [];

  for (const url of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      allItems.push(...feed.items.slice(0, 5)); // Take top 5 from each
    } catch (err) {
      console.error(`Error parsing RSS feed ${url}:`, err);
    }
  }

  // Deduplicate and filter for AI relevance if needed (here we assume the feeds are AI specific)
  for (const item of allItems) {
    const exists = await News.findOne({ sourceUrl: item.link });
    if (exists) continue;

    // Use Gemini to summarize the external content
    const sanitizedTitle = sanitizePrompt(item.title || "");
    const sanitizedContent = sanitizePrompt((item.contentSnippet || item.content) || "");
    
    const prompt = `Summarize the following AI news article for a professional briefing. 
    Title: ${sanitizedTitle}
    Content Snippet: ${sanitizedContent}
    
    Provide a JSON object with:
    "summary": (1-2 sentences)
    "category": (one of: model, research, business, tools, regulation, general)
    "tags": (array of 3-5 keywords)
    
    Return ONLY JSON.`;

    try {
      const result = await model.generateContent(prompt);
      const data = JSON.parse((await result.response).text().replace(/```json|```/g, '').trim());

      await News.create({
        title: item.title,
        summary: data.summary,
        category: data.category,
        source: item.creator || 'External Feed',
        sourceUrl: item.link,
        tags: data.tags,
        isAIGenerated: false,
        publishedAt: new Date(item.pubDate || Date.now())
      });
    } catch (err) {
      console.error(`Error processing news item ${item.title}:`, err);
    }
  }
}
