import { Router } from 'express';
import { handleChat, handleCode, handleSummarize, handleImageGen, handleResearch, handleWrite, handlePersona } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';
import { aiValidator, textValidator } from '../middleware/validators.js';

const router = Router();

router.post('/chat', authenticateToken, aiValidator, handleChat);
router.post('/code', authenticateToken, aiValidator, handleCode);
router.post('/summarize', authenticateToken, textValidator, handleSummarize);
router.post('/image', authenticateToken, aiValidator, handleImageGen);
router.post('/research', authenticateToken, aiValidator, handleResearch);
router.post('/write', authenticateToken, aiValidator, handleWrite);
router.post('/persona', authenticateToken, aiValidator, handlePersona);

export default router;
