import { Request, Response } from 'express';
import { AdminDashboardService } from '../../services/Admin Dashboard Service/adminDashboard';
import { database } from '../../config/database';

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
      const avgCosts = await dashboardService.getAvgExpenseCosts();
      const totalProducts = await dashboardService.getTotalProducts();
      const totalPackages = await dashboardService.getTotalPackages();
      const totalCategories = await dashboardService.getTotalCategories();
      const totalSubCategories = await dashboardService.getTotalSubCategories();
      const totalActiveOffers = await dashboardService.getTotalActiveOffers();
      const getAvgPriceForOrders = await dashboardService.getAvgPriceForOrders();
      const AverageSale = await dashboardService.averageSale();
      const TotalSale = await dashboardService.totalSale();
      const calculateGlobalAverageRating = await dashboardService.calculateGlobalAverageRating();
      const monthlyEarnings  = await dashboardService.getMonthlyEarnings();
      res.status(200).json({
        totalUsers,
        activeUsers,
        totalOrders,
        totalRevenue,
        topProducts,
        recentOrders,
        avgCosts,
        monthlyEarnings,
        totalProducts,
        totalPackages,
        totalCategories,
        totalSubCategories,
        totalActiveOffers,
        getAvgPriceForOrders,
        TotalSale,
        AverageSale,
        calculateGlobalAverageRating
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Error fetching dashboard data' });
    }
  }
}
