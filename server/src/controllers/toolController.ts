import { Request, Response, NextFunction } from 'express';
import Tool from '../models/Tool.js';
import { AppError } from '../middleware/errorHandler.js';

export const createTool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tool = await Tool.create({
      ...req.body,
      author: (req as any).user?.id
    });

    res.status(201).json({
      status: 'success',
      data: { tool }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const getTools = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, sort, recommended, limit } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    if (recommended === 'true') {
      // Basic recommendation: Top rated tools with at least 1 review
      query.avgRating = { $gte: 4 };
      query.reviewCount = { $gte: 1 };
    }

    let toolsQuery = Tool.find(query);

    if (sort) {
      const sortBy = (sort as string).split(',').join(' ');
      toolsQuery = toolsQuery.sort(`-isFeatured ${sortBy}`);
    } else {
      toolsQuery = toolsQuery.sort('-isFeatured -createdAt');
    }

    if (limit) {
      toolsQuery = toolsQuery.limit(parseInt(limit as string));
    }

    const tools = await toolsQuery;

    res.status(200).json({
      status: 'success',
      results: tools.length,
      data: { tools }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const getToolById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!tool) return next(new AppError('Tool not found', 404));

    res.status(200).json({
      status: 'success',
      data: { tool }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const trackClick = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    if (!tool) return next(new AppError('Tool not found', 404));

    res.status(200).json({ status: 'success' });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const updateTool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let tool = await Tool.findById(req.params.id);
    if (!tool) return next(new AppError('Tool not found', 404));

    // Check ownership or admin
    if (tool.author?.toString() !== (req as any).user?.id && (req as any).user?.role !== 'admin') {
      return next(new AppError('You do not have permission to update this tool', 403));
    }

    tool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: { tool }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const deleteTool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return next(new AppError('Tool not found', 404));

    // Check ownership or admin
    if (tool.author?.toString() !== (req as any).user?.id && (req as any).user?.role !== 'admin') {
      return next(new AppError('You do not have permission to delete this tool', 403));
    }

    await Tool.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const getCreatorTools = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tools = await Tool.find({ author: (req as any).user?.id }).sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: tools.length,
      data: { tools }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};
