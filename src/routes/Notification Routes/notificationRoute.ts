// create notificatin , get 
import express from 'express';
import { c_addNotification, c_getNotification } from '../../controllers/Notification Controller/notificationController';
const notificatinRoute = express.Router();

/**
 *  @description  create new notification
 *  @route        /notifications/:userId
 *  @method       Post
 *  @access       private 
 * 
 */
notificatinRoute.post("/notifications/:userId",c_addNotification);


/**
 *  @description  get a notification the user
 *  @route        /notification
 *  @method       get
 *  @access       private 
 * 
 */
notificatinRoute.get("/notification",c_getNotification);

export default notificatinRoute;