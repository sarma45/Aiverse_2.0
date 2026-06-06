import { Request, Response, NextFunction } from 'express';
import Thread from '../models/Thread.js';
import Comment from '../models/Comment.js';
import { AppError } from '../middleware/errorHandler.js';

export const createThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thread = await Thread.create({
      ...req.body,
      author: (req as any).user?.id
    });
    res.status(201).json({ status: 'success', data: { thread } });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const getThreads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    let query: any = {};
    if (category) query.category = category;

    const threads = await Thread.find(query).populate('author', 'name').sort('-createdAt');
    res.status(200).json({ status: 'success', results: threads.length, data: { threads } });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const getThreadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thread = await Thread.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('author', 'name');
    if (!thread) return next(new AppError('Thread not found', 404));

    const comments = await Comment.find({ thread: thread._id }).populate('author', 'name').sort('createdAt');

    res.status(200).json({
      status: 'success',
      data: { thread, comments }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      author: (req as any).user?.id
    });
    res.status(201).json({ status: 'success', data: { comment } });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
