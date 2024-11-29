import { Users } from "../entities/users/Users";
import { Notifications } from "../entities/users/Notifications";
import nodemailer from 'nodemailer';
import admin from "../config/firebase-config";

export const createWelcomeNotificationTemplate = (userName: string) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Fantasize</title>
    <style>
        body, h1, h2, p {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #000;
        }
        body {
            background-color: #c62828;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-size: 16px;
            overflow: hidden;
        }
        .header {
            background-color: #e57373;
            color: #000;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 25px;
            color: #000;
            line-height: 1.5;
        }
        .footer {
            background-color: #f1f1f1;
            color: #888;
            font-size: 12px;
            padding: 15px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to Fantasize, ${userName}!</h1>
        </div>
        <div class="content">
            <p>Thank you for creating an account with us. We are thrilled to have you on board!</p>
            <p>Explore our features and enjoy a fantastic experience.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Fantasize. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

        `;
};

async function sendWelcomeNotification(userId: any): Promise<void> {
    console.log("sendWelcomeNotification");
    const user = await Users.findOne({ where: { UserID: userId } });
    
    if (!user) {
        console.error(`User not found with ID: ${userId}`);
        return;
    }
    
    if (!user.DeviceToken) {
        console.error(`DeviceToken is missing for user ID: ${userId}`);
    }
    
    if (!user.Email) {
        console.error(`Email is missing for user ID: ${userId}`);
        return;
    }

    const subject = 'Welcome to Fantasize!';
    const userName = user.Username || 'User';

    const template = {
        body: `Welcome, ${userName}! Thank you for joining us.`,
    };

    await sendPushNotification(user.DeviceToken, subject, template);

    await sendEmailNotification(user.Email, subject, userName);

    const notification = new Notifications();
    notification.user = user;
    notification.template = template;
    notification.subject = subject;
    await notification.save();
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

async function sendEmailNotification(email: string, subject: string, userName: string): Promise<void> {
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
        html: createWelcomeNotificationTemplate(userName),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Successfully sent email notification to:', email);
    } catch (error: unknown) {
        console.error('Error sending email notification:', error);
        
        if (error instanceof Error) {
            console.error('Email Error Response:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}

export { sendWelcomeNotification };

