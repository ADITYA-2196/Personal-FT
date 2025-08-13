/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Spending analytics
 */
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as ctrl from '../controllers/analytics.controller.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();
router.use(authenticate);

// Cache analytics per user & query
const keyBuilder = (req) => `user:${req.user.id}:analytics:${JSON.stringify(req.query)}`;

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: Monthly/yearly overview
 */
router.get('/overview', cacheMiddleware(keyBuilder, 120), ctrl.overview);

/**
 * @swagger
 * /api/analytics/categories:
 *   get:
 *     tags: [Analytics]
 *     summary: Category distribution
 */
router.get('/categories', cacheMiddleware(keyBuilder, 120), ctrl.byCategory);

/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     tags: [Analytics]
 *     summary: Income vs Expense trends
 */
router.get('/trends', cacheMiddleware(keyBuilder, 120), ctrl.trends);

export default router;
