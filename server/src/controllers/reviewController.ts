import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review.js';
import { AppError } from '../middleware/errorHandler.js';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.create({
      ...req.body,
      user: (req as any).user?.id
    });

    res.status(201).json({
      status: 'success',
      data: { review }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const getReviewsByTool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ tool: req.params.toolId }).populate('user', 'name');

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));

    // Check if user is the author
    if (review.user.toString() !== (req as any).user?.id) {
      return next(new AppError('You can only delete your own reviews', 403));
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};
