import express from 'express';
import { isAuthorized } from '../../middlewares/isAuthentecated';
import { c_addNotification, c_deleteNotification,
     c_getAllNotification, c_getNotifications,c_sendNotification,c_sendPushNotification} from '../../controllers/Notification Controller/notificationController';

const notificationRoute = express.Router();

/**
 *  @description   Add a new notification
 *  @route         /notifications
 *  @method        POST
 *  @access        private (admin)
 */
notificationRoute.post('/add', isAuthorized, c_addNotification);

/**
 *  @description   Get notifications for a user
 *  @route         /notifications/:userId
 *  @method        GET
 *  @access        private (user)
 */
notificationRoute.get('/:userId', isAuthorized, c_getNotifications);

/**
 *  @description   Get All notifications
 *  @route         /
 *  @method        GET
 *  @access        private (Admin)
 */
notificationRoute.get('/', isAuthorized, c_getAllNotification);


/**
 *  @description   Delete a notification
 *  @route         /notifications/:notificationId
 *  @method        DELETE
 *  @access        private (admin)
 */
notificationRoute.delete('/:notificationId', isAuthorized, c_deleteNotification);

/**
 *  @description   Send a notification
 *  @route         /notifications/send
 *  @method        POST
 *  @access        private (admin)
 */
notificationRoute.post('/send', isAuthorized, c_sendNotification);

/**
 *  @description   Send a push notification
 *  @route         /notifications/sendPush
 *  @method        POST
 *  @access        private (admin)
 */
notificationRoute.post('/sendPush', isAuthorized, c_sendPushNotification);

export default notificationRoute;
