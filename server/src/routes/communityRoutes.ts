import express from 'express';
import * as communityController from '../controllers/communityController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/threads', communityController.getThreads);
router.get('/threads/:id', communityController.getThreadById);

// Protected routes
router.post('/threads', authenticateToken, communityController.createThread);
router.post('/comments', authenticateToken, communityController.createComment);

export default router;
