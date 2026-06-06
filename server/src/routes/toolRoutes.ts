import express from 'express';
import * as toolController from '../controllers/toolController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', toolController.getTools);
router.get('/creator', authenticateToken, toolController.getCreatorTools);
router.get('/:id', toolController.getToolById);
router.post('/:id/click', toolController.trackClick);

// Protected routes
router.post('/', authenticateToken, toolController.createTool);
router.patch('/:id', authenticateToken, toolController.updateTool);
router.delete('/:id', authenticateToken, toolController.deleteTool);

export default router;
