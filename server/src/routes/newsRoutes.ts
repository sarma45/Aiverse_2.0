import express from 'express';
import * as newsController from '../controllers/newsController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', newsController.getNews);

// Admin only routes for generating or creating news
router.post('/generate', authenticateToken, authorizeAdmin, newsController.generateDailyBriefing);
router.post('/', authenticateToken, authorizeAdmin, newsController.createNewsManually);

export default router;
