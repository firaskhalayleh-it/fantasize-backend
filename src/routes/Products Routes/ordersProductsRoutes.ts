import express from "express";
const orderProductRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /users/:userId/orders
 *  @method        POST
 *  @access        private 
 */
orderProductRoute.post('/users/:userId/orders');

/**
 *  @description   Get all orders for a user
 *  @route         /users/:userId/orders
 *  @method        GET
 *  @access        private
 */
orderProductRoute.get('/users/:userId/orders');

/**
 *  @description   Get all orders
 *  @route         /orders
 *  @method        GET
 *  @access        private
 */
orderProductRoute.get('/orders');

/**
 *  @description   Update an order status
 *  @route         /orders/:orderId
 *  @method        PUT
 *  @access        private
 */
orderProductRoute.put('/orders/:orderId');

/**
 *  @description   Delete an order
 *  @route         /orders/:orderId
 *  @method        DELETE
 *  @access        private
 */
orderProductRoute.delete('/orders/:orderId');

export default orderProductRoute;
