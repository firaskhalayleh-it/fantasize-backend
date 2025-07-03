import { Request, Response } from 'express';
import { Orders } from '../../entities/Orders';

/**
 * Enhanced order service with real-time WebSocket notifications
 */
export class EnhancedOrderService {
    /**
     * Update order status with real-time notification
     */
    public static async updateOrderStatus(
        orderId: string, 
        newStatus: string, 
        details?: any
    ): Promise<boolean> {
        try {
            // Update order in database
            const order = await Orders.findOne({ 
                where: { OrderID: parseInt(orderId, 10) },
                relations: ['User']
            });

            if (!order) {
                console.error(`Order ${orderId} not found`);
                return false;
            }

            const oldStatus = order.Status;
            order.Status = newStatus;
            await order.save();

            // Send real-time notification via WebSocket
            const webSocketService = (global as any).webSocketService;
            if (webSocketService) {
                // Notify the user who placed the order
                await webSocketService.sendToUser(
                    order.User.UserID.toString(),
                    'order_status_changed',
                    {
                        orderId,
                        oldStatus,
                        newStatus,
                        details: details || {},
                        timestamp: new Date().toISOString()
                    }
                );

                // Send to order tracking room
                await webSocketService.sendOrderUpdate(orderId, newStatus, {
                    orderDetails: details,
                    statusChangedAt: new Date().toISOString()
                });

                // Notify admin users
                await webSocketService.sendToRole('admin', 'admin_order_update', {
                    orderId,
                    userId: order.User.UserID,
                    oldStatus,
                    newStatus,
                    timestamp: new Date().toISOString()
                });

                console.log(`Real-time notification sent for order ${orderId} status change: ${oldStatus} -> ${newStatus}`);
            }

            return true;
        } catch (error) {
            console.error('Failed to update order status:', error);
            return false;
        }
    }

    /**
     * Notify inventory changes
     */
    public static async notifyInventoryChange(
        productId: string, 
        newQuantity: number, 
        changeType: 'decrease' | 'increase' | 'restock',
        details?: any
    ): Promise<boolean> {
        try {
            const webSocketService = (global as any).webSocketService;
            if (webSocketService) {
                // Send inventory update to all subscribers
                await webSocketService.sendInventoryUpdate(productId, newQuantity, {
                    changeType,
                    details: details || {},
                    updatedAt: new Date().toISOString()
                });

                // Notify admin users
                await webSocketService.sendToRole('admin', 'admin_inventory_update', {
                    productId,
                    newQuantity,
                    changeType,
                    timestamp: new Date().toISOString()
                });

                // Send low stock alert if quantity is low
                if (newQuantity <= 5 && changeType === 'decrease') {
                    await webSocketService.sendToRole('admin', 'low_stock_alert', {
                        productId,
                        currentQuantity: newQuantity,
                        alertLevel: newQuantity === 0 ? 'critical' : 'warning',
                        timestamp: new Date().toISOString()
                    });
                }

                console.log(`Inventory notification sent for product ${productId}: ${newQuantity} (${changeType})`);
            }

            return true;
        } catch (error) {
            console.error('Failed to notify inventory change:', error);
            return false;
        }
    }

    /**
     * Send real-time notification to user
     */
    public static async sendUserNotification(
        userId: string,
        notification: {
            title: string;
            message: string;
            type: 'info' | 'success' | 'warning' | 'error';
            data?: any;
        }
    ): Promise<boolean> {
        try {
            const webSocketService = (global as any).webSocketService;
            if (webSocketService) {
                await webSocketService.sendRealTimeNotification(userId, notification);
                console.log(`Real-time notification sent to user ${userId}: ${notification.title}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to send user notification:', error);
            return false;
        }
    }

    /**
     * Broadcast system announcement
     */
    public static async broadcastSystemAnnouncement(
        title: string,
        message: string,
        type: 'maintenance' | 'feature' | 'alert' | 'promotion' = 'feature',
        targetRole?: string
    ): Promise<boolean> {
        try {
            const webSocketService = (global as any).webSocketService;
            if (webSocketService) {
                const announcement = {
                    title,
                    message,
                    type,
                    timestamp: new Date().toISOString()
                };

                if (targetRole) {
                    await webSocketService.sendToRole(targetRole, 'system_announcement', announcement);
                } else {
                    await webSocketService.sendToAll('system_announcement', announcement);
                }

                console.log(`System announcement broadcasted: ${title}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to broadcast system announcement:', error);
            return false;
        }
    }
}

/**
 * Controller for real-time operations
 */
export const realTimeController = {
    // Get WebSocket connection status
    async getConnectionStatus(req: Request, res: Response) {
        try {
            const webSocketService = (global as any).webSocketService;
            if (!webSocketService) {
                return res.status(503).json({
                    success: false,
                    message: 'WebSocket service not available'
                });
            }

            const connectedUsersCount = webSocketService.getConnectedUsersCount();
            const adminUsers = webSocketService.getConnectedUsersByRole('admin');
            const regularUsers = webSocketService.getConnectedUsersByRole('user');

            res.json({
                success: true,
                data: {
                    totalConnections: connectedUsersCount,
                    adminConnections: adminUsers.length,
                    userConnections: regularUsers.length,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get connection status'
            });
        }
    },

    // Send test notification (admin only)
    async sendTestNotification(req: Request, res: Response) {
        try {
            const { userId, title, message, type = 'info' } = req.body;

            if (!userId || !title || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'userId, title, and message are required'
                });
            }

            const success = await EnhancedOrderService.sendUserNotification(userId, {
                title,
                message,
                type,
                data: { isTest: true }
            });

            res.json({
                success,
                message: success ? 'Test notification sent' : 'Failed to send notification'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to send test notification'
            });
        }
    },

    // Broadcast system announcement (admin only)
    async broadcastAnnouncement(req: Request, res: Response) {
        try {
            const { title, message, type = 'feature', targetRole } = req.body;

            if (!title || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'title and message are required'
                });
            }

            const success = await EnhancedOrderService.broadcastSystemAnnouncement(
                title, 
                message, 
                type, 
                targetRole
            );

            res.json({
                success,
                message: success ? 'Announcement broadcasted' : 'Failed to broadcast announcement'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to broadcast announcement'
            });
        }
    },

    // Check if specific user is connected
    async checkUserConnection(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const webSocketService = (global as any).webSocketService;

            if (!webSocketService) {
                return res.status(503).json({
                    success: false,
                    message: 'WebSocket service not available'
                });
            }

            const isConnected = webSocketService.isUserConnected(userId);

            res.json({
                success: true,
                data: {
                    userId,
                    isConnected,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to check user connection'
            });
        }
    }
};