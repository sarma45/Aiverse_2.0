import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/tool/:toolId', reviewController.getReviewsByTool);

// Protected routes
router.post('/', authenticateToken, reviewController.createReview);
router.delete('/:id', authenticateToken, reviewController.deleteReview);

export default router;
