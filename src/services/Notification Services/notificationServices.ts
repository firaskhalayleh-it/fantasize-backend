import { Notifications } from "../../entities/users/Notifications";
import { Users } from "../../entities/users/Users";
import { sendEmail } from "../../utils/email-config";

export class NotificationService {
    // Create a new notification and send it based on type
    async createAndSendNotification(userId: string, type: 'email' | 'push', templateData: any) {
        // Fetch the user
        if (!userId) {
            throw new Error('User ID is required');
        }
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        const notification = new Notifications();
        notification.user = user;
        notification.type = type;
        notification.template = templateData;

        // Decide on the delivery method based on the notification type
        if (type === 'email') {
            notification.deliveryMethod = 'smtp';
            const emailSent = await this.sendEmailNotification(user, templateData);
            notification.sent = emailSent;
        } else if (type === 'push') {
            notification.deliveryMethod = 'push';
            // const pushSent = await this.sendPushNotification(user, templateData);
            // notification.sent = pushSent;
        }

        // Save the notification to the database
        await notification.save();
        return notification;
    }

    // Send email notification
    private async sendEmailNotification(user: Users, templateData: any): Promise<boolean> {
        const { subject, body, footer } = templateData;
        const emailContent = {
            subject: this.applyTemplate(subject, user),
            body: this.applyTemplate(`${body}\n\n${footer}`, user)
        };


        return await sendEmail({
            to: user.Email,
            subject: emailContent.subject,
            html: emailContent.body
        });
    }

    // Send push notification
    // private async sendPushNotification(user: Users, templateData: any): Promise<boolean> {
    //     const { title, body, actionUrl } = templateData;
    //     const pushContent = {
    //         title: this.applyTemplate(title, user),
    //         body: this.applyTemplate(body, user),
    //         actionUrl: this.applyTemplate(actionUrl, user)
    //     };

    //     if (!user.FirebaseToken) {
    //         console.error('User does not have a push notification token');
    //         return false;
    //     }

    //     return await sendPushNotification(user.FirebaseToken, pushContent.title, pushContent.body, pushContent.actionUrl);
    // }

    // Apply the template placeholders (e.g., {{username}})
    private applyTemplate(template: string, user: Users): string {
        return template.replace('{{username}}', user.Username);
    }

    // Fetch notifications for a specific user
    async getUserNotifications(userId: string) {
        const user = await Users.findOne({ where: { UserID: userId }, relations: ["notifications"] },);
        if (!user) {
            throw new Error('User not found');
        }
        return user.notifications;
    }

    // Mark a notification as read
    async markAsRead(notificationId: number) {
        const notification = await Notifications.findOne({ where: { notificationID: notificationId } });
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.isRead = true;
        await notification.save();
        return notification;
    }
}
