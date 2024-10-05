import { Request, Response } from 'express';
import { AdminDashboardService } from '../../services/Admin Dashboard Service/adminDashboard';

export class AdminDashboardController {
  
  static async getDashboardData(req: Request, res: Response) {
    try {
      const dashboardService = new AdminDashboardService();

      const totalUsers = await dashboardService.getTotalUsers();
      const activeUsers = await dashboardService.getActiveUsers();
      const totalOrders = await dashboardService.getTotalOrders();
      const totalRevenue = await dashboardService.getTotalRevenue();
      const topProducts = await dashboardService.getTopProducts();
      const recentOrders = await dashboardService.getRecentOrders();

      res.status(200).json({
        totalUsers,
        activeUsers,
        totalOrders,
        totalRevenue,
        topProducts,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Error fetching dashboard data' });
    }
  }
}
