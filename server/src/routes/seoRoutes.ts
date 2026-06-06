import express from 'express';
import * as seoController from '../controllers/seoController.js';

const router = express.Router();

router.get('/sitemap.xml', seoController.getSitemap);

export default router;
