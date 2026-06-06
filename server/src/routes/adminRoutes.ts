import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, authorizeAdmin, adminController.getRevenueStats);

export default router;
