import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { redisService } from '../../config/redis';
import jwt from 'jsonwebtoken';

interface UserSocket {
    userId: string;
    role: string;
    socketId: string;
    joinedRooms: string[];
    lastActivity: Date;
}

export class WebSocketService {
    private static instance: WebSocketService;
    private io: SocketIOServer;
    private connectedUsers: Map<string, UserSocket> = new Map();

    private constructor(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: process.env.CORS_ORIGIN || "*",
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket', 'polling']
        });

        this.setupSocketHandlers();
        this.setupPeriodicCleanup();
    }

    public static getInstance(server?: HTTPServer): WebSocketService {
        if (!WebSocketService.instance && server) {
            WebSocketService.instance = new WebSocketService(server);
        }
        return WebSocketService.instance;
    }

    private setupSocketHandlers(): void {
        this.io.on('connection', (socket) => {
            console.log(`Socket connected: ${socket.id}`);

            // Authentication middleware
            socket.on('authenticate', async (token: string) => {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
                    const userSocket: UserSocket = {
                        userId: decoded.userId,
                        role: decoded.role || 'user',
                        socketId: socket.id,
                        joinedRooms: [],
                        lastActivity: new Date()
                    };

                    this.connectedUsers.set(socket.id, userSocket);
                    
                    // Join user-specific room
                    socket.join(`user:${decoded.userId}`);
                    userSocket.joinedRooms.push(`user:${decoded.userId}`);

                    // Join role-based room
                    socket.join(`role:${userSocket.role}`);
                    userSocket.joinedRooms.push(`role:${userSocket.role}`);

                    socket.emit('authenticated', { 
                        success: true, 
                        userId: decoded.userId,
                        rooms: userSocket.joinedRooms
                    });

                    // Store user connection in Redis for cross-instance communication
                    await this.storeUserConnection(userSocket);

                    console.log(`User ${decoded.userId} authenticated via socket ${socket.id}`);
                } catch (error) {
                    socket.emit('authentication_error', { message: 'Invalid token' });
                    socket.disconnect();
                }
            });

            // Join specific rooms
            socket.on('join_room', async (room: string) => {
                const userSocket = this.connectedUsers.get(socket.id);
                if (userSocket) {
                    socket.join(room);
                    userSocket.joinedRooms.push(room);
                    userSocket.lastActivity = new Date();
                    
                    socket.emit('room_joined', { room });
                    console.log(`User ${userSocket.userId} joined room: ${room}`);
                }
            });

            // Leave specific rooms
            socket.on('leave_room', (room: string) => {
                const userSocket = this.connectedUsers.get(socket.id);
                if (userSocket) {
                    socket.leave(room);
                    userSocket.joinedRooms = userSocket.joinedRooms.filter(r => r !== room);
                    userSocket.lastActivity = new Date();
                    
                    socket.emit('room_left', { room });
                    console.log(`User ${userSocket.userId} left room: ${room}`);
                }
            });

            // Handle order tracking subscription
            socket.on('track_order', (orderId: string) => {
                const userSocket = this.connectedUsers.get(socket.id);
                if (userSocket) {
                    const orderRoom = `order:${orderId}`;
                    socket.join(orderRoom);
                    userSocket.joinedRooms.push(orderRoom);
                    socket.emit('order_tracking_started', { orderId });
                }
            });

            // Handle inventory tracking subscription
            socket.on('track_inventory', (productId: string) => {
                const userSocket = this.connectedUsers.get(socket.id);
                if (userSocket) {
                    const inventoryRoom = `inventory:${productId}`;
                    socket.join(inventoryRoom);
                    userSocket.joinedRooms.push(inventoryRoom);
                    socket.emit('inventory_tracking_started', { productId });
                }
            });

            // Handle ping/pong for connection health
            socket.on('ping', () => {
                const userSocket = this.connectedUsers.get(socket.id);
                if (userSocket) {
                    userSocket.lastActivity = new Date();
                }
                socket.emit('pong');
            });

            // Handle disconnection
            socket.on('disconnect', async () => {
                const userSocket = this.connectedUsers.get(socket.id);
                if (userSocket) {
                    await this.removeUserConnection(userSocket);
                    this.connectedUsers.delete(socket.id);
                    console.log(`User ${userSocket.userId} disconnected (socket: ${socket.id})`);
                }
            });
        });
    }

    private async storeUserConnection(userSocket: UserSocket): Promise<void> {
        try {
            const key = `websocket:user:${userSocket.userId}`;
            await redisService.set(key, {
                socketId: userSocket.socketId,
                role: userSocket.role,
                joinedRooms: userSocket.joinedRooms,
                lastActivity: userSocket.lastActivity.toISOString()
            }, 3600); // 1 hour TTL
        } catch (error) {
            console.error('Failed to store user connection in Redis:', error);
        }
    }

    private async removeUserConnection(userSocket: UserSocket): Promise<void> {
        try {
            const key = `websocket:user:${userSocket.userId}`;
            await redisService.del(key);
        } catch (error) {
            console.error('Failed to remove user connection from Redis:', error);
        }
    }

    private setupPeriodicCleanup(): void {
        // Clean up inactive connections every 5 minutes
        setInterval(() => {
            const now = new Date();
            const inactiveThreshold = 30 * 60 * 1000; // 30 minutes

            for (const [socketId, userSocket] of this.connectedUsers.entries()) {
                const timeSinceLastActivity = now.getTime() - userSocket.lastActivity.getTime();
                if (timeSinceLastActivity > inactiveThreshold) {
                    const socket = this.io.sockets.sockets.get(socketId);
                    if (socket) {
                        socket.disconnect();
                    }
                    this.connectedUsers.delete(socketId);
                    console.log(`Cleaned up inactive connection for user ${userSocket.userId}`);
                }
            }
        }, 5 * 60 * 1000); // Every 5 minutes
    }

    // Public methods for sending notifications

    /**
     * Send notification to a specific user
     */
    public async sendToUser(userId: string, event: string, data: any): Promise<boolean> {
        try {
            this.io.to(`user:${userId}`).emit(event, data);
            
            // Also store in Redis for cross-instance delivery
            const notificationKey = `notification:${userId}:${Date.now()}`;
            await redisService.set(notificationKey, { event, data }, 3600);
            
            return true;
        } catch (error) {
            console.error(`Failed to send notification to user ${userId}:`, error);
            return false;
        }
    }

    /**
     * Send notification to users with specific role
     */
    public async sendToRole(role: string, event: string, data: any): Promise<boolean> {
        try {
            this.io.to(`role:${role}`).emit(event, data);
            return true;
        } catch (error) {
            console.error(`Failed to send notification to role ${role}:`, error);
            return false;
        }
    }

    /**
     * Send notification to all connected users
     */
    public async sendToAll(event: string, data: any): Promise<boolean> {
        try {
            this.io.emit(event, data);
            return true;
        } catch (error) {
            console.error('Failed to send notification to all users:', error);
            return false;
        }
    }

    /**
     * Send order status update
     */
    public async sendOrderUpdate(orderId: string, status: string, details: any): Promise<boolean> {
        try {
            this.io.to(`order:${orderId}`).emit('order_status_update', {
                orderId,
                status,
                details,
                timestamp: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error(`Failed to send order update for ${orderId}:`, error);
            return false;
        }
    }

    /**
     * Send inventory update
     */
    public async sendInventoryUpdate(productId: string, quantity: number, details: any): Promise<boolean> {
        try {
            this.io.to(`inventory:${productId}`).emit('inventory_update', {
                productId,
                quantity,
                details,
                timestamp: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error(`Failed to send inventory update for ${productId}:`, error);
            return false;
        }
    }

    /**
     * Send real-time notification
     */
    public async sendRealTimeNotification(userId: string, notification: {
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        data?: any;
    }): Promise<boolean> {
        return this.sendToUser(userId, 'real_time_notification', {
            ...notification,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Get connected users count
     */
    public getConnectedUsersCount(): number {
        return this.connectedUsers.size;
    }

    /**
     * Get connected users by role
     */
    public getConnectedUsersByRole(role: string): UserSocket[] {
        return Array.from(this.connectedUsers.values()).filter(user => user.role === role);
    }

    /**
     * Check if user is connected
     */
    public isUserConnected(userId: string): boolean {
        return Array.from(this.connectedUsers.values()).some(user => user.userId === userId);
    }

    /**
     * Get socket instance for advanced operations
     */
    public getSocketIO(): SocketIOServer {
        return this.io;
    }
}

// Export singleton instance
export let webSocketService: WebSocketService;