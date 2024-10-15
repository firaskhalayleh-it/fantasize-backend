
/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send a notification to a user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to whom the notification is sent
 *               type:
 *                 type: string
 *                 enum: [email, push]
 *                 description: Type of notification to send
 *               templateData:
 *                 type: object
 *                 description: Data to be included in the notification template
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       500:
 *         description: Failed to send notification
 */

/**
 * @swagger
 * /api/notifications/{userId}:
 *   get:
 *     summary: Get notifications for a user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to fetch notifications
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications for the user
 *       500:
 *         description: Failed to fetch notifications
 */

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: The ID of the notification to mark as read
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       500:
 *         description: Failed to mark notification as read
 */
