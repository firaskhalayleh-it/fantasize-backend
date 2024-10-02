
import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';
import { IsAuthenticated, isAuthorized } from '../../middlewares/isAuthentecated';
import { c_checkoutOrder, c_createNewOrderUser, c_getAllOrders, c_getAllOrdersForUser } from '../../controllers/Packages Controller/ordersPackagesController';

const orderPackageRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /users/:userId/orders
 *  @method        POST
 *  @access        private 
 */
orderPackageRoute.post('/orderpackage',IsAuthenticated,c_createNewOrderUser);

/**
 *  @description   Get all orders for a user
 *  @route         /users/:userId/orders
 *  @method        GET
 *  @access        private
 */
orderPackageRoute.get('/orderpackage',IsAuthenticated,c_getAllOrdersForUser);


/**
 *  @description   Get all orders
 *  @route         /orders
 *  @method        GET
 *  @access        admin
 */
orderPackageRoute.get('/AllordersPackages',isAuthorized,c_getAllOrders);

/**
 * @description   Checkout an order
 * @route         /orders/:orderId
 * @method        put
 * @access        private
 * 
 */
orderPackageRoute.put('/checkout/:orderId',IsAuthenticated,c_checkoutOrder);//changes the status of order to true (complete)to make order not in cart view


export default orderPackageRoute;