import { Request, Response, NextFunction } from 'express';
import Agent from '../models/Agent.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, premium } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (premium === 'true') query.isPremium = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { capabilities: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const agents = await Agent.find(query).sort('-avgRating');

    res.status(200).json({
      status: 'success',
      results: agents.length,
      data: { agents }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const getAgentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agent = await Agent.findById(req.params.id).populate('author', 'name');
    if (!agent) return next(new AppError('Agent not found', 404));

    res.status(200).json({
      status: 'success',
      data: { agent }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const createAgent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agent = await Agent.create({
      ...req.body,
      author: (req as any).user?.id
    });

    res.status(201).json({
      status: 'success',
      data: { agent }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
