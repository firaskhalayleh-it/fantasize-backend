import { Request, Response } from 'express';
import { Notifications } from '../../entities/users/Notifications';
import { Users } from '../../entities/users/Users';
import nodemailer from 'nodemailer';
import { createNotificationTemplate } from '../../utils/OfferNotification';
import 'dotenv/config';
import { sendEmail } from '../../utils/email-config';
import { sendPushNotification, sendPushNotificationToMultiple } from '../../utils/push-sender';


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
    try {
        const { userId } = req.params;
        const notifications = await Notifications.find({ where: { user: { UserID: userId } }, order: { createdAt: 'DESC' } });

        if (!notifications.length) {
            return `No notifications found for this user.`;
        }

        return notifications;

    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
};

//----------------------- Get All Notification -----------------------
export const s_getAllNotification = async (req: Request, res: Response) => {
    try {
        // Retrieve notifications ordered by createdAt descending
        const notifications = await Notifications.find({
            order: { createdAt: 'DESC' },
        });

        // Check if notifications exist
        if (!notifications || notifications.length === 0) {
            return res.status(404).send({ msg: "No notifications found for this user." });
        }

        return res.status(200).send(notifications);
    } catch (err: any) {
        // Log error for debugging and send appropriate error response
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};


//----------------------- Delete a notification -----------------------
export const s_deleteNotification = async (req: Request, res: Response) => {
    try {
        const { notificationId }: any = req.params;
        const notification = await Notifications.findOne({ where: { notificationID: notificationId } });

        if (!notification) {
            return `Notification not found.`;
        }

        await notification.remove();
        return `Notification deleted successfully.`;
    } catch (err: any) {
        res.status(500).send({ message: err.message });
    }
};

//----------------------- send notification -----------------------
export const s_sendNotification = async (req: Request, res: Response) => {
    try {
        const { title, body } = req.body;
        const users = await Users.find({ select: ['Email'] });

        if (!users.length) {
            return res.status(404).send({ message: 'No users found to send notifications.' });
        }

        const emailPromises = users.map(user => sendEmail({ to: user.Email, subject: title, html: body }));
        await Promise.all(emailPromises);

        await Notifications.insert({ subject: title, template: body });

        return res.status(200).send({ message: 'Notification sent successfully.' });
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

// send push notification to all users
export const s_sendPushNotification = async (req: Request, res: Response) => {
    try {
        const { title, body, actionUrl, imageUrl,buttons } = req.body;
        const users = await Users.find({ select: ['DeviceToken'] });

        if (!users.length) {
            return res.status(404).send({ message: 'No users found to send notifications.' });
        }
        const filteredUsers = users.filter(user => user.DeviceToken !== null);
        const pushPromises = filteredUsers.map(user => sendPushNotification(user.DeviceToken, title, body, actionUrl || 'https://example.com', imageUrl || 'https://example.com/image.png',buttons));
        await Promise.all(pushPromises);

        await Notifications.insert({ subject: title, template: body });

        return res.status(200).send({ message: 'Notification sent successfully.' });
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

// send push notification to multiple users
