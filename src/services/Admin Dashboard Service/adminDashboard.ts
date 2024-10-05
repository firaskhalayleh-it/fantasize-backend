import { getRepository } from 'typeorm';
import { Orders } from '../../entities/Orders';
import { Products } from '../../entities/products/Products';
import { Notifications } from '../../entities/users/Notifications';
import { Users } from '../../entities/users/Users';
import { OrdersProducts } from '../../entities/products/OrdersProducts';


export class AdminDashboardService {

    // Total registered users
    async getTotalUsers() {
        const userCount = (Users)
            .createQueryBuilder('users')
            .select('COUNT(users.UserID)', 'total_users')
            .getRawOne();

        return userCount;
    }

    // Active users (logged in within the last 30 days)
    async getActiveUsers() {
        const activeUsers = (Users)
            .createQueryBuilder('users')
            .select('COUNT(users.UserID)', 'active_users')
            .where('users.lastlogin >= NOW() - INTERVAL \'30 days\'')
            .getRawOne();

        return activeUsers;
    }

    // Total orders
    async getTotalOrders() {
        const totalOrders = (Orders)
            .createQueryBuilder('Orders')
            .select('COUNT(Orders.OrderID)', 'total_orders')
            .getRawOne();

        return totalOrders;
    }

    // Total revenue
    async getTotalRevenue() {
        const totalRevenue = (Orders)
            .createQueryBuilder('Orders')
            .select('SUM(Orders.TotalPrice)', 'total_revenue')
            .where('Orders.Status = :status', { status: true })
            .getRawOne();

        return totalRevenue;
    }

    // Top products by quantity sold
    async getTopProducts() {
        const topProducts = await Products
            .createQueryBuilder('products')
            .innerJoin('products.OrdersProducts', 'OrdersProducts')  // Join OrdersProducts on the Product relation
            .innerJoin('OrdersProducts.Order', 'Orders')  // Join Orders on the OrdersProducts relation
            .select('products.Name', 'product_name')
            .addSelect('SUM(OrdersProducts.Quantity)', 'total_quantity')
            .where('Orders.Status = :status', { status: true })
            .groupBy('products.Name')
            .orderBy('total_quantity', 'DESC')
            .limit(5)
            .getRawMany();

        return topProducts;
    }




    // Recent orders
    async getRecentOrders() {
        const recentOrders = await (Orders)
            .createQueryBuilder('Orders')
            .innerJoin('Orders.User', 'Users')
            .select('Orders.OrderID', 'order_id')
            .addSelect('Users.Username', 'user_name')
            .addSelect('Orders.TotalPrice', 'total_price')
            .addSelect('Orders.CreatedAt', 'order_date')
            .orderBy('Orders.CreatedAt', 'DESC')
            .limit(10)
            .getRawMany();

        return recentOrders;
    }
}




