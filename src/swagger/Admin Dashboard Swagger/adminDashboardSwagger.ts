/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data for admin
 *     tags: [Admin Dashboard]
 *     description: Retrieves relevant data for the admin dashboard, including metrics and statistics.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
