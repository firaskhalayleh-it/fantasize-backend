
import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';

const orderPackageRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /users/:userId/orders
 *  @method        POST
 *  @access        private 
 */
orderPackageRoute.post('/order/:userId/orders',authMiddleware);

/**
 *  @description   Get all orders for a user
 *  @route         /users/:userId/orders
 *  @method        GET
 *  @access        private
 */
orderPackageRoute.get('/order/:userId/orders',authMiddleware);


/**
 *  @description   Get all orders
 *  @route         /orders
 *  @method        GET
 *  @access        admin
 */
orderPackageRoute.get('/orders',authMiddleware,adminMiddleware);

/**
 * @description   Checkout an order
 * @route         /orders/:orderId
 * @method        put
 * @access        private
 * 
 */
orderPackageRoute.put('/checkout/:orderId',authMiddleware);//changes the status of order to true (complete)to make order not in cart view


export default orderPackageRoute;