// order route

import express from 'express';
import { IsAuthenticated,isAuthorized } from '../../middlewares/isAuthentecated';
import { c_checkoutOrderUser, c_getAllOrders, c_getOrder, c_getAllOrdersAdmin,c_getAllOrdersUser } from '../../controllers/Order Controller/orderController';

const orderRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /order
 *  @method        POST
 *  @access        private 
 */
orderRoute.post('/order',IsAuthenticated,c_checkoutOrderUser);

/**
 *  @description   Get all orders
 *  @route         /orders
 *  @method        GET
 *  @access        private
 */
orderRoute.get('/orders',IsAuthenticated,c_getAllOrders);

/**
 *  @description   Get all orders for a user
 *  @route         /orders
 *  @method        GET
 *  @access        private
 */
orderRoute.get('/orders/:userId',IsAuthenticated,c_getAllOrdersUser);

/**
 *  @description   Get all orders for a user
 *  @route         /orders
 *  @method        GET
 *  @access        private
 */
orderRoute.get('/orders/admin',IsAuthenticated,isAuthorized,c_getAllOrdersAdmin);

/**
 *  @description   Get a single order by ID
 *  @route         /orders/:orderId
 *  @method        GET
 *  @access        private
 */
orderRoute.get('/orders/:orderId',IsAuthenticated,c_getOrder);

export default orderRoute;