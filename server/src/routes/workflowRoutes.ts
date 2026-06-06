import express from 'express';
import * as workflowController from '../controllers/workflowController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', workflowController.getWorkflows);
router.post('/', authenticateToken, workflowController.createWorkflow);
router.post('/:id/execute', authenticateToken, workflowController.executeWorkflow);

export default router;
