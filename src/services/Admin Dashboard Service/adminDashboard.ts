import { getRepository } from 'typeorm';
import { Orders } from '../../entities/Orders';
import { Products } from '../../entities/products/Products';
import { Notifications } from '../../entities/users/Notifications';
import { Users } from '../../entities/users/Users';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Packages } from '../../entities/packages/Packages';
import { Categories } from '../../entities/categories/Categories';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Offers } from '../../entities/Offers';
import { OrdersPackages } from '../../entities/packages/OrdersPackages';
import { Reviews } from '../../entities/Reviews';


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

    async getAvgExpenseCosts() {
        const avgCosts = await (Orders)
            .createQueryBuilder('orders')
            .select('AVG(orders.TotalPrice)', 'avg_cost')
            .where('orders.Status = :status', { status: true })
            .getRawOne();

        return parseFloat(avgCosts?.avg_cost) || 0;
    }

    async getMonthlyEarnings() {
        const monthlyEarnings = await (Orders)
            .createQueryBuilder('orders')
            .select('SUM(orders.TotalPrice)', 'monthly_earnings')
            .addSelect("TO_CHAR(orders.CreatedAt, 'Mon')", 'month')
            .where('orders.Status = :status', { status: true })
            .groupBy("TO_CHAR(orders.CreatedAt, 'Mon')")
            .orderBy("TO_CHAR(orders.CreatedAt, 'Mon')")
            .getRawMany();

        const earnings: Record<string, number> = {};
        monthlyEarnings.forEach((result) => {
            earnings[result.month] = parseFloat(result.monthly_earnings) || 0;
        });

        return earnings;
    }

    async getTotalProducts() {
        const productCount = await Products
            .createQueryBuilder('products')
            .select('COUNT(products.ProductID)', 'total_products')
            .getRawOne();

        return productCount;
    }

    async getTotalPackages() {
        const packageCount = await Packages
            .createQueryBuilder('packages')
            .select('COUNT(packages.PackageID)', 'total_packages')
            .getRawOne();

        return packageCount;
    }
    async getTotalCategories() {
        const categoryCount = await Categories
            .createQueryBuilder('categories')
            .select('COUNT(categories.CategoryID)', 'total_categories')
            .getRawOne();

        return categoryCount;
    }
    async getTotalSubCategories() {
        const subCategoryCount = await SubCategories
            .createQueryBuilder('subCategories')
            .select('COUNT(subCategories.SubCategoryID)', 'total_subcategories')
            .getRawOne();

        return subCategoryCount;
    }
    
      // Fetch the total number of active offers
  async getTotalActiveOffers() {
    const activeOfferCount = await Offers
      .createQueryBuilder('offers')
      .where('offers.IsActive = :isActive', { isActive: false })
      .select('COUNT(offers.OfferID)', 'total_active_offers')
      .getRawOne();

    return activeOfferCount;
  }

  async getAvgPriceForOrders() {
    // Fetch all orders with their products and packages
    const avgPriceResult = await Orders.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.OrdersProducts', 'ordersProducts') // Join products
      .leftJoinAndSelect('orders.OrdersPackages', 'ordersPackages') // Join packages
      .select('AVG(orders.TotalPrice)', 'avg_price') // Calculate the average total price for all orders
      .getRawOne();

    return avgPriceResult;
  }

   async TotalSale(): Promise<number> {
    const orders = await Orders.find({
      where: { Status: true },
      select: ['TotalPrice'],
    });

    let totalSales = 0;
    orders.forEach(order => {
      totalSales += Number(order.TotalPrice);
    });

    return totalSales;
  }

   async AverageSale(): Promise<number> {
    const orders = await Orders.find({
      where: { Status: true },
      select: ['TotalPrice'],
    });

    let totalSales = 0;
    let totalOrders = orders.length;

    orders.forEach(order => {
      totalSales += Number(order.TotalPrice);
    });

    return totalOrders > 0 ? totalSales / totalOrders : 0;
  }


   async calculateGlobalAverageRating(): Promise<string> {
    const allReviews = await Reviews.find({ relations: ['Products', 'Packages'], select: ['Rating'] });

    if (allReviews.length === 0) return "0.00";

    const totalRating = allReviews.reduce((acc, review) => acc + review.Rating, 0);
    const totalReviews = allReviews.length;

    const averageRating = totalRating / totalReviews;

    const normalizedRating = Math.min(Math.max(averageRating, 0), 5);

    return normalizedRating.toFixed(2);
  }
}




