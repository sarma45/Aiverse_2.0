import { Request, Response, NextFunction } from 'express';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Tool from '../models/Tool.js';
import { AppError } from '../middleware/errorHandler.js';

export const getRevenueStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await Transaction.find().sort('-createdAt');
    
    const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
    const subscriptionRevenue = transactions.filter(t => t.type === 'subscription').reduce((acc, t) => acc + t.amount, 0);
    const promotionRevenue = transactions.filter(t => t.type === 'promotion').reduce((acc, t) => acc + t.amount, 0);
    
    const totalUsers = await User.countDocuments();
    const proUsers = await User.countDocuments({ subscription: 'pro' });
    const featuredTools = await Tool.countDocuments({ isFeatured: true });

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalRevenue,
          subscriptionRevenue,
          promotionRevenue,
          totalUsers,
          proUsers,
          featuredTools,
          transactionCount: transactions.length
        },
        recentTransactions: transactions.slice(0, 10)
      }
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};
