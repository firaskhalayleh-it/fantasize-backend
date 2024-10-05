import { Request, Response } from 'express';
import { NotificationService } from '../../services/Notification Services/notificationServices';

export class NotificationController {
  // Send a notification to a user
  static async sendNotification(req: Request, res: Response) {
    const { userId, type, templateData } = req.body;

    try {
      const notificationService = new NotificationService();
      const notification = await notificationService.createAndSendNotification(userId, type, templateData);

      res.status(200).json({ message: 'Notification sent successfully', notification });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ message: 'Failed to send notification' });
    }
  }

  // Fetch notifications for a user
  static async getUserNotifications(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const notificationService = new NotificationService();
      const notifications = await notificationService.getUserNotifications(String(userId));

      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  }

  // Mark a notification as read
  static async markNotificationAsRead(req: Request, res: Response) {
    const { notificationId } = req.params;

    try {
      const notificationService = new NotificationService();
      const notification = await notificationService.markAsRead(Number(notificationId));

      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  }
}
