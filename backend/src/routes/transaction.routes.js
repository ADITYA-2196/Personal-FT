/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Manage income/expense transactions
 */
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as ctrl from '../controllers/transaction.controller.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: List transactions (own for non-admin)
 */
router.get('/', ctrl.list);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create transaction (admin & user)
 */
router.post('/', authorize('admin', 'user'), ctrl.create);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     tags: [Transactions]
 *     summary: Update transaction (admin & user if owner)
 */
router.put('/:id', authorize('admin', 'user'), ctrl.update);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     tags: [Transactions]
 *     summary: Delete transaction (admin & user if owner)
 */
router.delete('/:id', authorize('admin', 'user'), ctrl.remove);

export default router;
