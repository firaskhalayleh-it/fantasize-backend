import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";
import { IsAuthenticated, isAuthorized } from "../../middlewares/isAuthentecated";
import { c_checkoutOrder, c_createNewOrderUser, c_getAllOrders, c_getAllOrdersForUser } from "../../controllers/Products Controller/ordersProductsController";
const orderProductRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /users/:userId/orders
 *  @method        POST
 *  @access        private 
 */
orderProductRoute.post('/order/:userId/orders', isAuthorized ,c_createNewOrderUser);

/**
 *  @description   Get all orders for a user
 *  @route         /users/:userId/orders
 *  @method        GET
 *  @access        private
 */
orderProductRoute.get('/order/:userId/orders',IsAuthenticated ,c_getAllOrdersForUser);

/**
 *  @description   Get all orders
 *  @route         /orders
 *  @method        GET
 *  @access        admin
 */
orderProductRoute.get('/orders',isAuthorized ,c_getAllOrders);

/**
 * @description   Checkout an order
 * @route         /orders/:orderId
 * @method        put
 * @access        private
 * 
 */
orderProductRoute.put('/checkout/:orderId',IsAuthenticated ,c_checkoutOrder);//changes the status of order to true (complete)to make order not in cart view


export default orderProductRoute;
