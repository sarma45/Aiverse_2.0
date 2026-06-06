import { validationResult, body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(message, 400));
  }
  next();
};

export const registerValidator = [
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('name').notEmpty().withMessage('Name is required').trim(),
  validateRequest
];

export const loginValidator = [
  body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

export const aiValidator = [
  body('prompt').notEmpty().withMessage('Prompt is required').trim().isLength({ max: 5000 }).withMessage('Prompt is too long'),
  validateRequest
];

export const textValidator = [
  body('text').notEmpty().withMessage('Text is required').trim().isLength({ max: 10000 }).withMessage('Text is too long'),
  validateRequest
];
