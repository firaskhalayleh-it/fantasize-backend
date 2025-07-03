import express from 'express';
import { healthController } from '../../services/Health Services/healthService';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get comprehensive health check
 *     tags: [Health]
 *     description: Returns detailed health status of the application including database, Redis, memory, and disk checks
 *     responses:
 *       200:
 *         description: Service is healthy or degraded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, unhealthy, degraded]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 version:
 *                   type: string
 *                 environment:
 *                   type: string
 *                 checks:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: object
 *                     redis:
 *                       type: object
 *                     memory:
 *                       type: object
 *                     disk:
 *                       type: object
 *                 metrics:
 *                   type: object
 *       503:
 *         description: Service is unhealthy
 */
router.get('/health', healthController.health);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Get readiness check
 *     tags: [Health]
 *     description: Returns whether the service is ready to handle requests
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ready:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       503:
 *         description: Service is not ready
 */
router.get('/health/ready', healthController.ready);

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Get liveness check
 *     tags: [Health]
 *     description: Returns whether the service is alive
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alive:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       503:
 *         description: Service is not alive
 */
router.get('/health/live', healthController.live);

export default router;