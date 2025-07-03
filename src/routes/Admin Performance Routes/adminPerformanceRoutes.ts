import express from 'express';
import { performanceController } from '../../services/Performance Services/performanceService';
import { isAuthorized } from '../../middlewares/isAuthentecated';

const router = express.Router();

/**
 * @swagger
 * /admin/performance/metrics:
 *   get:
 *     summary: Get performance metrics
 *     tags: [Admin Performance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeWindow
 *         schema:
 *           type: integer
 *           default: 300000
 *         description: Time window in milliseconds for metrics aggregation
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/admin/performance/metrics', isAuthorized, performanceController.getMetrics);

/**
 * @swagger
 * /admin/performance/slow-requests:
 *   get:
 *     summary: Get slow requests
 *     tags: [Admin Performance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of slow requests to return
 *     responses:
 *       200:
 *         description: Slow requests retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/admin/performance/slow-requests', isAuthorized, performanceController.getSlowRequests);

/**
 * @swagger
 * /admin/performance/summary:
 *   get:
 *     summary: Get performance summary
 *     tags: [Admin Performance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance summary retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/admin/performance/summary', isAuthorized, performanceController.getSummary);

export default router;