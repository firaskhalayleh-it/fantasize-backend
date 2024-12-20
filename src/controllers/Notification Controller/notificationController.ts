import { Request, Response } from 'express';
import { s_deleteNotification, s_getAllNotification } from '../../services/Notification Services/notificationServices';
import { s_getNotifications } from '../../services/Notification Services/notificationServices';
import { s_addNotification,s_sendNotification ,s_sendPushNotification} from '../../services/Notification Services/notificationServices';

//-----------------------Add a new notification -----------------------
export const c_addNotification = async (req: Request, res: Response) => {
    const result = await s_addNotification(req, res);
    res.status(200).json(result);
};

//----------------------- Get notifications for a user -----------------------
export const c_getNotifications = async (req: Request, res: Response) => {
    const result = await s_getNotifications(req, res);
    res.status(200).json(result);
};

//----------------------- Get notifications for a user -----------------------
export const c_getAllNotification = async (req: Request, res: Response) => {
    const result = await s_getAllNotification(req, res);
    res.status(200).json(result);
};

//----------------------- Delete a notification -----------------------
export const c_deleteNotification = async (req: Request, res: Response) => {
    const result = await s_deleteNotification(req, res);
    res.status(200).json(result);
};

//----------------------- Send a notification -----------------------
export const c_sendNotification = async (req: Request, res: Response) => {
    const result = await s_sendNotification(req, res);
    res.status(200).json(result);
};

//----------------------- Send a push notification -----------------------
export const c_sendPushNotification = async (req: Request, res: Response) => {
    const result = await s_sendPushNotification(req, res);
    res.status(200).json(result);
};
