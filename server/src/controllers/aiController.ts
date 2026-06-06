import { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { AppError } from '../middleware/errorHandler.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return next(new AppError('Prompt is required', 400));

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({
      role: 'assistant',
      content: text
    });
  } catch (error) {
    next(new AppError('Chat processing failed', 500));
  }
};

export const handleCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) return next(new AppError('Prompt is required', 400));

    const codePrompt = `Write clean, efficient code for the following task in ${language || 'typescript'}. Return ONLY the code, no explanation.\nTask: ${prompt}`;
    
    const result = await model.generateContent(codePrompt);
    const response = await result.response;
    const codeText = response.text();

    res.json({
      code: codeText,
      language: language || 'typescript'
    });
  } catch (error) {
    next(new AppError('Code generation failed', 500));
  }
};

export const handleSummarize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    if (!text) return next(new AppError('Text is required for summarization', 400));

    const summaryPrompt = `Summarize the following text concisely and provide actionable bullet points:\n\n${text}`;
    
    const result = await model.generateContent(summaryPrompt);
    const response = await result.response;
    const summaryText = response.text();

    res.json({
      summary: summaryText
    });
  } catch (error) {
    next(new AppError('Summarization failed', 500));
  }
};

export const handleImageGen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return next(new AppError('Prompt is required for image generation', 400));
    
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    res.json({
      imageUrl,
      prompt
    });
  } catch (error) {
    next(new AppError('Image generation failed', 500));
  }
};

export const handleResearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return next(new AppError('Prompt is required for research', 400));

    const researchPrompt = `Act as a professional researcher. Provide a deep, structured analysis of the following topic with verified-style citations (e.g. [1], [2]). Use bullet points and clear headings.\nTopic: ${prompt}`;
    
    const result = await model.generateContent(researchPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      content: text
    });
  } catch (error) {
    next(new AppError('Research processing failed', 500));
  }
};

export const handleWrite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, tone } = req.body;
    if (!prompt) return next(new AppError('Prompt is required for writing', 400));

    const writingPrompt = `Write the following content in a ${tone || 'professional'} tone:\n${prompt}`;
    
    const result = await model.generateContent(writingPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      content: text
    });
  } catch (error) {
    next(new AppError('Writing processing failed', 500));
  }
};

export const handlePersona = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, personaId } = req.body;
    if (!prompt) return next(new AppError('Prompt is required', 400));
    
    let systemInstruction = "";
    switch (personaId) {
      case 'storyteller':
        systemInstruction = "You are a friendly, imaginative storyteller for children. Use simple, engaging language and always be encouraging and fun.";
        break;
      case 'companion':
        systemInstruction = "You are a warm, patient, and empathetic companion for an elderly person. Speak clearly, be respectful, and engage in thoughtful, unhurried conversation.";
        break;
      case 'educator':
        systemInstruction = "You are an expert educator and lesson planner. Provide structured, pedogogically sound explanations, curriculum ideas, and teaching strategies.";
        break;
      case 'medical':
        systemInstruction = "You are a knowledgeable medical assistant. Provide accurate clinical information for educational purposes, but always begin your response with a disclaimer that you are an AI and not a substitute for professional medical advice.";
        break;
      case 'architect':
        systemInstruction = "You are a senior software system architect. Provide high-level system design, architecture patterns, scalability strategies, and best practices.";
        break;
      case 'finance':
        systemInstruction = "You are an expert Chartered Accountant and financial analyst. Provide precise accounting principles, tax strategies, and financial data analysis.";
        break;
      case 'translator':
        systemInstruction = "You are a professional polyglot and translator. Accurately translate text between any languages while preserving nuances, idioms, and cultural context.";
        break;
      case 'legal':
        systemInstruction = "You are a legal research assistant. Help users understand legal concepts, document structures, and general regulations. Always state that you are an AI and not a lawyer.";
        break;
      case 'travel':
        systemInstruction = "You are an expert travel planner and local guide. Create detailed itineraries, suggest hidden gems, and provide travel logistics for any destination.";
        break;
      case 'fitness':
        systemInstruction = "You are a certified personal trainer and nutritionist. Design workout routines and meal plans based on user goals and health data.";
        break;
      case 'chef':
        systemInstruction = "You are a world-class executive chef. Provide recipes, cooking techniques, and meal prep advice based on available ingredients and dietary needs.";
        break;
      case 'marketing':
        systemInstruction = "You are a senior marketing strategist. Create brand identities, social media campaigns, and market analysis for any business or product.";
        break;
      default:
        systemInstruction = "You are a helpful AI assistant.";
    }

    const personaPrompt = `${systemInstruction}\n\nUser Request: ${prompt}`;
    
    const result = await model.generateContent(personaPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      content: text
    });
  } catch (error) {
    next(new AppError('Persona processing failed', 500));
  }
};
