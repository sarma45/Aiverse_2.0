import { Request, Response, NextFunction } from 'express';
import Collection from '../models/Collection.js';
import { AppError } from '../middleware/errorHandler.js';

export const createCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.create({
      ...req.body,
      author: (req as any).user?.id
    });

    res.status(201).json({
      status: 'success',
      data: { collection }
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const getCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await Collection.find({ isPublic: true }).populate('tools', 'name category avgRating');
    res.status(200).json({
      status: 'success',
      results: collections.length,
      data: { collections }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const getCollectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collection = await Collection.findById(req.params.id).populate('tools');
    if (!collection) return next(new AppError('Collection not found', 404));

    res.status(200).json({
      status: 'success',
      data: { collection }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};
