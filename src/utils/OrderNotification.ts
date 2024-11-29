import { Users } from "../entities/users/Users";
import { Notifications } from "../entities/users/Notifications";
import nodemailer from 'nodemailer';
import admin from "../config/firebase-config";

export const createOrderNotificationTemplate = (orderId: string, orderSummary: string) => {
    return `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation from Fantasize</title>
    <style>
        body, h1, h2, p, a {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #ffffff;
            text-align: center;
        }
        body {
            background-color: #07010b;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ff0000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            font-size: 16px;
        }
        .header {
            background-color: #ff0000;
            color: white;
            padding: 20px;
        }
        .header h1 {
            color: white;
            font-size: 26px;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .content {
            background-color: #f3f3f3;
            padding: 25px 20px;
            color: #000000;
        }
        .content p {
            color: #000000;
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
        }
        .footer {
            background-color: #ff0000;
            color: #ffffff;
            font-size: 12px;
            padding: 15px;
            border-top: 1px solid #ffffff;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for shopping with Fantasize!</p>
        </div>
        <div class="content">
            <p>Your order has been successfully placed.</p>
            <p>Order ID: ${orderId}</p>
            <p>${orderSummary}</p>
        </div>
        <div class="footer">
            <p>If you did not place this order, please contact our support team.</p>
            <p>Thank you for choosing Fantasize!</p>
        </div>
    </div>
</body>
</html>

    `;
};

async function sendOrderNotification(userId: any, orderId: any, orderSummary: any): Promise<void> {
    const user = await Users.findOne({ where: { UserID: userId } });

    if (user) {
        const subject = 'Order Confirmation';
        const template = {
            body: 'Your order has been successfully placed. Thank you for shopping with Fantasize!',
        };

        if (user.DeviceToken) {
            await sendPushNotification(user.DeviceToken, subject, template);
        }

        if (user.Email) {
            await sendEmailNotification(user.Email, subject, template, orderId, orderSummary);
        }

        const notification = new Notifications();
        notification.user = user;
        notification.template = template;
        notification.subject = subject;
        await notification.save();
    }
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

async function sendEmailNotification(email: string, subject: string, template: any, orderId: string, orderSummary: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Fantasize" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: createOrderNotificationTemplate(orderId, orderSummary),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Successfully sent email notification to:', email);
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}

export default sendOrderNotification ;
