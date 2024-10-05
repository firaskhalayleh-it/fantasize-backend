import express from 'express';
import { NotificationController } from '../../controllers/Notification Controller/notificationController';
import { isAuthorized } from '../../middlewares/isAuthentecated';


const notificationRoute = express.Router();

/**
 *  @description   Send notification to a user
 *  @route         POST /notifications/send
 *  @method        POST
 *  @access        Private (Admin)
 */
notificationRoute.post('/notifications/send', isAuthorized, NotificationController.sendNotification);

/**
 *  @description   Get notifications for a user
 *  @route         GET /notifications/:userId
 *  @method        GET
 *  @access        Private (Authenticated User)
 */
notificationRoute.get('/notifications/:userId', isAuthorized, NotificationController.getUserNotifications);

/**
 *  @description   Mark a notification as read
 *  @route         PATCH /notifications/:notificationId/read
 *  @method        PATCH
 *  @access        Private (Authenticated User)
 */
notificationRoute.patch('/notifications/:notificationId/read', isAuthorized, NotificationController.markNotificationAsRead);

export default notificationRoute;
