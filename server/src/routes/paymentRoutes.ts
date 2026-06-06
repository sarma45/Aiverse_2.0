import { Router } from 'express';
import { createOrder, verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/order', authenticateToken, createOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.post('/webhook', handleWebhook); // Webhook doesn't use JWT, uses secret verification

export default router;
