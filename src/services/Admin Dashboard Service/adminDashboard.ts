import { Orders } from '../../entities/Orders';
import { Products } from '../../entities/products/Products';
import { Users } from '../../entities/users/Users';
import { Packages } from '../../entities/packages/Packages';
import { Categories } from '../../entities/categories/Categories';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Offers } from '../../entities/Offers';
import { Reviews } from '../../entities/Reviews';
import { In } from 'typeorm';

export class AdminDashboardService {
  /**
   * Get the total number of registered users.
   */
  async getTotalUsers(): Promise<number> {
    return Users.createQueryBuilder('users')
      .getCount();
  }

  /**
   * Get the number of active users (those who have logged in within the last 30 days).
   */
  async getActiveUsers(): Promise<number> {
    return Users.createQueryBuilder('users')
      .where('users.lastlogin >= NOW() - INTERVAL \'30 days\'')
      .getCount();
  }

  /**
   * Get the total number of orders.
   */
  async getTotalOrders(): Promise<number> {
    return Orders.createQueryBuilder('orders')
      .getCount();
  }

  /**
   * Get the total revenue (sum of total price of completed orders).
   */
  async getTotalRevenue(): Promise<number> {
    const result = await Orders.createQueryBuilder('orders')
      .select('SUM(orders.TotalPrice)', 'total_revenue')
      .where('orders.Status = :status', { status: 'purchased' })
      .getRawOne();
    return parseFloat(result?.total_revenue) || 0;
  }

  /**
   * Get the top 5 products by quantity sold.
   */
  async getTopProducts(): Promise<{ product_name: string; total_quantity: number }[]> {
    const results = await Products.createQueryBuilder('products')
      .innerJoin('products.OrdersProducts', 'ordersProducts')
      .innerJoin('ordersProducts.Order', 'orders')
      .select('products.Name', 'product_name')
      .addSelect('SUM(ordersProducts.Quantity)', 'total_quantity')
      .where('orders.Status IN (:...statuses)', { statuses: ['purchased', 'completed','delivered'] })
      .groupBy('products.Name')
      .orderBy('total_quantity', 'DESC')
      .limit(5)
      .getRawMany();

    return results.map(item => ({
      product_name: item.product_name,
      total_quantity: parseInt(item.total_quantity, 10) || 0,
    }));
  }

  /**
   * Get the 10 most recent orders with user name and total price.
   */
  async getRecentOrders(): Promise<Array<{ order_id: number; user_name: string; total_price: number; order_date: Date; status: string }>> {
    // Only select necessary columns to reduce overhead
    const results = await Orders.createQueryBuilder('orders')
      .innerJoin('orders.User', 'users')
      .select([
        'orders.OrderID as order_id',
        'users.Username as user_name',
        'orders.TotalPrice as total_price',
        'orders.Status as status',
        'orders.CreatedAt as order_date',
      ])
      .orderBy('orders.CreatedAt', 'DESC')
      .limit(10)
      .getRawMany();

    return results.map(item => ({
      order_id: parseInt(item.order_id, 10),
      user_name: item.user_name,
      total_price: parseFloat(item.total_price),
      order_date: item.order_date,
      status: item.status,
    }));
  }

  /**
   * Get the average expense cost (average order price) for completed orders.
   */
  async getAvgExpenseCosts(): Promise<number> {
    const result = await Orders.createQueryBuilder('orders')
      .select('AVG(orders.TotalPrice)', 'avg_cost')
      .where('orders.Status IN (:...statuses)', { statuses: ['purchased', 'completed','delivered'] })
      .getRawOne();
    return parseFloat(result?.avg_cost) || 0;
  }

  /**
   * Get the monthly earnings for completed orders.
   * Using date_trunc for better performance and indexing rather than using to_char.
   */
  async getMonthlyEarnings(): Promise<Record<string, number>> {
    const results = await Orders.createQueryBuilder('orders')
      .select('SUM(orders.TotalPrice)', 'monthly_earnings')
      .addSelect("TO_CHAR(date_trunc('month', orders.\"CreatedAt\"), 'Mon')", 'month')
      .where('orders.Status IN (:...statuses)', { statuses: ['purchased', 'completed','delivered'] })
      .groupBy("date_trunc('month', orders.\"CreatedAt\")")
      .orderBy("date_trunc('month', orders.\"CreatedAt\")")
      .getRawMany();

    const earnings: Record<string, number> = {};
    for (const result of results) {
      earnings[result.month] = parseFloat(result.monthly_earnings) || 0;
    }

    return earnings;
  }

  /**
   * Get the total number of products.
   */
  async getTotalProducts(): Promise<number> {
    return Products.createQueryBuilder('products')
      .getCount();
  }

  /**
   * Get the total number of packages.
   */
  async getTotalPackages(): Promise<number> {
    return Packages.createQueryBuilder('packages')
      .getCount();
  }

  /**
   * Get the total number of categories.
   */
  async getTotalCategories(): Promise<number> {
    return Categories.createQueryBuilder('categories')
      .getCount();
  }

  /**
   * Get the total number of subcategories.
   */
  async getTotalSubCategories(): Promise<number> {
    return SubCategories.createQueryBuilder('subCategories')
      .getCount();
  }

  /**
   * Get the total number of active offers.
   */
  async getTotalActiveOffers(): Promise<number> {
    return Offers.createQueryBuilder('offers')
      .where('offers.IsActive = :isActive', { isActive: true })
      .getCount();
  }

  /**
   * Get the average price of all orders.
   */
  async getAvgPriceForOrders(): Promise<number> {
    const result = await Orders.createQueryBuilder('orders')
      .select('AVG(orders.TotalPrice)', 'avg_price')
      .getRawOne();
    return parseFloat(result?.avg_price) || 0;
  }

  /**
   * Get the total sales from all completed orders.
   */
  async totalSale(): Promise<number> {
    const result = await Orders.createQueryBuilder('orders')
      .select('SUM(orders.TotalPrice)', 'total_sales')
      .where('orders.Status = :status', { status: 'purchased' })
      .getRawOne();
    return parseFloat(result?.total_sales) || 0;
  }

  /**
   * Get the average sale amount for completed orders.
   */
  async averageSale(): Promise<number> {
    const result = await Orders.createQueryBuilder('orders')
      .select('AVG(orders.TotalPrice)', 'average_sale')
      .where('orders.Status = :status', { status: 'purchased' })
      .getRawOne();
    return parseFloat(result?.average_sale) || 0;
  }

  /**
   * Calculate the global average rating across all reviews.
   * Use a direct aggregate query instead of fetching all reviews.
   */
  async calculateGlobalAverageRating(): Promise<string> {
    const result = await Reviews.createQueryBuilder('reviews')
      .select('AVG(reviews.Rating)', 'avg_rating')
      .getRawOne();

    const averageRating = parseFloat(result?.avg_rating) || 0;
    const normalizedRating = Math.min(Math.max(averageRating, 0), 5);
    return normalizedRating.toFixed(2);
  }
}
