import express from 'express';
import * as collectionController from '../controllers/collectionController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', collectionController.getCollections);
router.get('/:id', collectionController.getCollectionById);

// Protected routes (Admin or Creator)
router.post('/', authenticateToken, authorizeAdmin, collectionController.createCollection);

export default router;
