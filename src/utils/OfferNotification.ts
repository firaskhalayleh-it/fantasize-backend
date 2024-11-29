import { Users } from "../entities/users/Users";
import { Notifications } from "../entities/users/Notifications";
import nodemailer from 'nodemailer';
import { Not, IsNull } from 'typeorm';
import admin from "../config/firebase-config";

export const createNotificationTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Offer Notification from Fantasize</title>
    <style>
        body, h1, h2, p, a {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #333;
            text-align: center;
        }

        body {
            background-color: #f3f3f5;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            font-size: 16px;
        }

        .header {
            background-color: #ad4444;
            color: white;
            padding: 20px;
        }

        .header h1 {
            color: white;
            font-size: 26px;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .header p {
            color: white;
            font-size: 18px;
        }

        .content {
            padding: 25px 20px;
            color: #333;
        }

        .offer-details h2 {
            font-size: 22px;
            color: #bf0e0ee1;
            margin: 15px 0;
        }

        .offer-details p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ad4b44;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 16px;
        }

        .button:hover {
            background-color: #000000;
        }

        .footer {
            background-color: #f1f1f1;
            color: #888;
            font-size: 12px;
            padding: 15px;
            border-top: 1px solid #ddd;
        }

        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>

<div class="email-container">
    <div class="header">
        <h1>Fantasize</h1>
        <p>Your gateway to exclusive offers</p>
    </div>

    <div class="content">
        <div class="offer-details">
            <h2>Exciting New Offer Just for You!</h2>
            <p>We’re thrilled to bring you an exclusive new offer. Don’t miss out on the chance to enjoy a special discount on some of our most popular products!</p>
            <a href="http://localhost:3000/api/offers_homeOffers" class="button">Explore the Offer</a>
        </div>
    </div>

    <div class="footer">
        <p>If you did not request this notification, please ignore it.</p>
        <p>Thank you for being part of Fantasize!</p>
    </div>
</div>

</body>
</html>`;
};

async function createNewOffer(): Promise<void> {
    const subject = 'New Offer';
    const template = {
        body: 'A new offer has been added just for you. Check the app for more details.',
        
    };

    await notifyAllUsers(subject, template);
}

async function notifyAllUsers(subject: string, template: any): Promise<void> {
    const users = await Users.find();

    if (users.length === 0) {
        console.warn('No users found.');
        return;
    }

    const notificationPromises = users.map(async (user) => {
        if (user.Email) {
            await sendEmailNotification(user.Email, subject, template);
        }

        if (user.DeviceToken) {
            await sendPushNotification(user.DeviceToken, subject, template);
        }

        const notification = new Notifications();
        notification.user = user;
        notification.template = template.body;
        notification.subject = subject;
        await notification.save();
    });

    await Promise.all(notificationPromises);
}

async function sendPushNotification(deviceToken: string, subject: string, template: any): Promise<void> {
    const message = {
        notification: {
            title: subject,
            body: template.body,
            // icon: 'https://your-icon-url.com/icon.png'
        },
        token: deviceToken,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent push notification:', response);
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}

async function sendEmailNotification(email: string, subject: string, template: any): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: createNotificationTemplate(),
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log('Successfully sent email notification to:', email);
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}

export { createNewOffer};