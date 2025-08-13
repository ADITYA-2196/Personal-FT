/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin user management
 */
import { Router } from 'express';
import { authenticate, authorize, allowSelfOrAdmin } from '../middleware/auth.js';
import * as ctrl from '../controllers/user.controller.js';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users (admin only)
 */
router.get('/', authorize('admin'), ctrl.list);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user (self or admin)
 */
router.get('/:id', allowSelfOrAdmin, ctrl.getOne);

export default router;
