// order route

import express from 'express';
import { IsAuthenticated, isAuthorized } from '../../middlewares/isAuthentecated';
import { c_checkoutOrderUser, c_getOrder, c_getAllOrdersAdmin,
     c_getAllOrdersUser, c_getCartForUser, c_updateOrderStatus
     ,c_approveOrder,c_rejectOrder,c_getOrdersForUser } from '../../controllers/Order Controller/orderController';

const orderRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /order
 *  @method        POST
 *  @access        private 
 */
orderRoute.post('/checkout', IsAuthenticated, c_checkoutOrderUser);


/**
 *  @description   Get all orders for a user
 *  @route         /orders/:userId
 *  @method        GET
 *  @access        private
 */
orderRoute.get('/orders', IsAuthenticated, c_getAllOrdersUser);

/**
 *  @description   Get all orders for a user
 *  @route         /orders
 *  @method        GET
 *  @access        private
 */
orderRoute.get('/orders/admin', isAuthorized, c_getAllOrdersAdmin);

/**
 *  @description   Get a single order by ID
 *  @route         /orders/:orderId
 *  @method        GET
 *  @access        private
 */
orderRoute.get('/orders/:orderId', IsAuthenticated, c_getOrder);

/**
 *  @description   Get cart for a user
 *  @route         /orders
 *  @method        GET
 *  @access        private
 */
export const userOrders = orderRoute.get('/cart', IsAuthenticated, c_getCartForUser);


/**
 * @description   Update order status
 * @route         /orders/:orderId
 * @method        PUT
 * @access        private
    */
orderRoute.patch('/orders/:orderId', IsAuthenticated, c_updateOrderStatus);

/**
 * @description   Approve order
 * @route         /orders/:orderId/approve
 * @method        PUT
 * @access        private
 */
orderRoute.patch('/orders/:orderId/approve', isAuthorized, c_approveOrder);

/**
 * @description   Reject order
 * @route         /orders/:orderId/reject
 * @method        PUT
 * @access        private
 */
orderRoute.patch('/orders/:orderId/reject', isAuthorized, c_rejectOrder);

/**
 * @description   Get orders for a user
 * @route         /user/orders/:userId
 * @method        GET
 * @access        private
 */
orderRoute.get('/user/orders/:userId', IsAuthenticated, c_getOrdersForUser);


export default orderRoute;