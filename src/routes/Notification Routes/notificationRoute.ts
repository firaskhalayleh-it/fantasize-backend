import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';

const notificationRoute = express.Router();

/**
 *  @description  Create a new notification for a specific user
 *  @route        POST /notifications/:userId
 *  @method       POST
 *  @access       Private (Admin)
 */
notificationRoute.post("/notifications/:userId", authMiddleware, adminMiddleware, );

/**
 *  @description  Create a new notification for all users
 *  @route        POST /notifications
 *  @method       POST
 *  @access       Private (Admin)
 */
notificationRoute.post('/notifications', authMiddleware, adminMiddleware, );

/**
 *  @description  Get notifications for a specific user
 *  @route        GET /notifications/:userId
 *  @method       GET
 *  @access       Private (Authenticated User)
 */
notificationRoute.get("/:userId/notifications", authMiddleware, );

/**
 *  @description  Send a notification to a specific user
 *  @route        POST /notifications/send/:userId
 *  @method       POST
 *  @access       Private (Admin)
 */
notificationRoute.post("/notifications/send/:userId", authMiddleware, adminMiddleware, );

/**
 *  @description  Send notifications to all users
 *  @route        POST /notifications/sendAll
 *  @method       POST
 *  @access       Private (Admin)
 */
notificationRoute.post("/notifications/sendAll", authMiddleware, adminMiddleware, );

export default notificationRoute;
