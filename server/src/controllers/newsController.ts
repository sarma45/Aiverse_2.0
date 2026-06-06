import { Request, Response, NextFunction } from 'express';
import News from '../models/News.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../middleware/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await News.find().sort('-publishedAt').limit(20);
    res.status(200).json({
      status: 'success',
      results: news.length,
      data: { news }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const generateDailyBriefing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real app, we'd fetch actual news headlines from an API like NewsAPI or RSS feeds
    // For this prototype, we'll use Gemini to "simulate" the latest AI news based on its internal knowledge
    // and format it into our database structure.
    
    const prompt = `Generate 5 high-quality, realistic news snippets about the latest trends in Artificial Intelligence for today (${new Date().toLocaleDateString()}). 
    Each news item must be a JSON object with: title, summary, category (one of: model, research, business, tools, regulation, general).
    Return ONLY a JSON array of these objects.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown from response
    const jsonString = text.replace(/```json|```/g, '').trim();
    const newsData = JSON.parse(jsonString);

    const savedNews = await News.insertMany(newsData.map((item: any) => ({
      ...item,
      isAIGenerated: true,
      publishedAt: new Date()
    })));

    res.status(201).json({
      status: 'success',
      data: { news: savedNews }
    });
  } catch (error: any) {
    console.error('Briefing Generation Error:', error);
    next(new AppError('Failed to generate daily briefing', 500));
  }
};

export const createNewsManually = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { news }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
