import express from 'express';
import { isAuthorized } from '../../middlewares/isAuthentecated';
import { AdminDashboardController } from '../../controllers/Admin Dashboard Controller/adminDashboard';


const adminDashboardRoutes = express.Router();

/**
 *  @description   Get KPI data for admin dashboard
 *  @route         GET /admin/dashboard
 *  @access        Private (Admin)
 */
adminDashboardRoutes.get('/dashboard', isAuthorized, AdminDashboardController.getDashboardData);

export default adminDashboardRoutes;
