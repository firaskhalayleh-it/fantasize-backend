import express from 'express';
import { realTimeController } from '../../services/Real-time Services/realTimeService';
import { isAuthorized, IsAuthenticated } from '../../middlewares/isAuthentecated';

const router = express.Router();

/**
 * @swagger
 * /realtime/connection-status:
 *   get:
 *     summary: Get WebSocket connection status
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connection status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalConnections:
 *                       type: number
 *                     adminConnections:
 *                       type: number
 *                     userConnections:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/realtime/connection-status', isAuthorized, realTimeController.getConnectionStatus);

/**
 * @swagger
 * /realtime/test-notification:
 *   post:
 *     summary: Send test notification to a user
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [info, success, warning, error]
 *                 default: info
 *     responses:
 *       200:
 *         description: Test notification sent successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/realtime/test-notification', isAuthorized, realTimeController.sendTestNotification);

/**
 * @swagger
 * /realtime/broadcast-announcement:
 *   post:
 *     summary: Broadcast system announcement
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [maintenance, feature, alert, promotion]
 *                 default: feature
 *               targetRole:
 *                 type: string
 *                 description: Optional role to target (if not provided, broadcasts to all)
 *     responses:
 *       200:
 *         description: Announcement broadcasted successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/realtime/broadcast-announcement', isAuthorized, realTimeController.broadcastAnnouncement);

/**
 * @swagger
 * /realtime/user-connection/{userId}:
 *   get:
 *     summary: Check if specific user is connected
 *     tags: [Real-time]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to check connection status
 *     responses:
 *       200:
 *         description: User connection status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     isConnected:
 *                       type: boolean
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/realtime/user-connection/:userId', isAuthorized, realTimeController.checkUserConnection);

export default router;