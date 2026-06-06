import express from 'express';
import * as agentController from '../controllers/agentController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', agentController.getAgents);
router.get('/:id', agentController.getAgentById);

// Protected routes
router.post('/', authenticateToken, agentController.createAgent);

export default router;
