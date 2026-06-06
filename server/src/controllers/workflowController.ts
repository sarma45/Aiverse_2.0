import { Request, Response, NextFunction } from 'express';
import Workflow from '../models/Workflow.js';
import Agent from '../models/Agent.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../middleware/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const createWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await Workflow.create({
      ...req.body,
      author: (req as any).user?.id
    });
    res.status(201).json({ status: 'success', data: { workflow } });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const getWorkflows = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflows = await Workflow.find({ isPublic: true }).populate('author', 'name');
    res.status(200).json({ status: 'success', results: workflows.length, data: { workflows } });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const executeWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return next(new AppError('Workflow not found', 404));

    const { input } = req.body;
    let currentOutput = input || "";
    const results = [];

    for (const step of workflow.steps) {
      let stepResult = "";

      if (step.type === 'prompt' && step.config?.prompt) {
        const prompt = `${step.config.prompt}\n\nInput: ${currentOutput}`;
        const genRes = await model.generateContent(prompt);
        stepResult = (await genRes.response).text();
      } else if (step.type === 'agent' && step.config?.agentId) {
        const agent = await Agent.findById(step.config.agentId);
        if (agent) {
          const prompt = `${agent.systemInstruction}\n\nTask: ${currentOutput}`;
          const genRes = await model.generateContent(prompt);
          stepResult = (await genRes.response).text();
        }
      }

      currentOutput = stepResult;
      results.push({ stepId: step.id, label: step.label, output: stepResult });
    }

    await Workflow.findByIdAndUpdate(workflow._id, { $inc: { usageCount: 1 } });

    res.status(200).json({
      status: 'success',
      data: {
        finalOutput: currentOutput,
        stepResults: results
      }
    });
  } catch (error: any) {
    console.error('Workflow Execution Error:', error);
    next(new AppError('Workflow execution failed', 500));
  }
};
