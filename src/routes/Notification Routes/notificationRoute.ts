import express from 'express';
import { isAuthorized } from '../../middlewares/isAuthentecated';
import { c_addNotification, c_deleteNotification, c_getNotifications} from '../../controllers/Notification Controller/notificationController';

const notificationRoute = express.Router();

/**
 *  @description   Add a new notification
 *  @route         /notifications
 *  @method        POST
 *  @access        private (admin)
 */
notificationRoute.post('/addNotification', isAuthorized, c_addNotification);

/**
 *  @description   Get notifications for a user
 *  @route         /notifications/:userId
 *  @method        GET
 *  @access        private (user)
 */
notificationRoute.get('/:userId', isAuthorized, c_getNotifications);


/**
 *  @description   Delete a notification
 *  @route         /notifications/:notificationId
 *  @method        DELETE
 *  @access        private (admin)
 */
notificationRoute.delete('/:notificationId', isAuthorized, c_deleteNotification);

export default notificationRoute;
