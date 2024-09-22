import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";
const orderProductRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /users/:userId/orders
 *  @method        POST
 *  @access        private 
 */
orderProductRoute.post('/order/:userId/orders',authMiddleware);

/**
 *  @description   Get all orders for a user
 *  @route         /users/:userId/orders
 *  @method        GET
 *  @access        private
 */
orderProductRoute.get('/order/:userId/orders',authMiddleware);

/**
 *  @description   Get all orders
 *  @route         /orders
 *  @method        GET
 *  @access        admin
 */
orderProductRoute.get('/orders',authMiddleware,adminMiddleware);

/**
 * @description   Checkout an order
 * @route         /orders/:orderId
 * @method        put
 * @access        private
 * 
 */
orderProductRoute.put('/checkout/:orderId',authMiddleware);//changes the status of order to true (complete)to make order not in cart view


export default orderProductRoute;
