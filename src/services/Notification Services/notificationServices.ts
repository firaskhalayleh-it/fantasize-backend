import { Request, Response } from 'express';
import { Notifications } from '../../entities/users/Notifications';
import { Users } from '../../entities/users/Users';
import nodemailer from 'nodemailer';
import { createNotificationTemplate } from '../../utils/OfferNotification';


//-----------------------Add a new notification -----------------------
export const s_addNotification = async (req: Request, res: Response) => {
    try {
        
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};



//----------------------- Get notifications for a user -----------------------
export const s_getNotifications = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;
        const notifications = await Notifications.find({ where: { user: { UserID: userId } }, order: { createdAt: 'DESC' } });
        
        if(!notifications.length) {
            return `No notifications found for this user.`;
        }

        return notifications;
    }catch (err: any) {
        res.status(500).send({ message: err.message });
    }
};

//----------------------- Get All Notification -----------------------
export const s_getAllNotification = async (req: Request, res: Response) => {
    try{
        const notifications = await Notifications.find({order: { createdAt: 'DESC' } });
        if(!notifications.length) {
            return res.status(404).send({msg: "No notifications found for this user."}) ;
        }

        return notifications;
    }catch (err: any) {
        res.status(500).send({ message: err.message });
    }
};

//----------------------- Delete a notification -----------------------
export const s_deleteNotification = async (req: Request, res: Response) => {
    try{
        const { notificationId }:any = req.params;
        const notification = await Notifications.findOne({ where: { notificationID: notificationId } });
        
        if(!notification) {
            return `Notification not found.`;
        }

        await notification.remove();
        return `Notification deleted successfully.`;
    }catch (err: any) {
        res.status(500).send({ message: err.message });
    }
};
