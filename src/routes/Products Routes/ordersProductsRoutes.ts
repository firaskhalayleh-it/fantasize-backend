// src/routes/orderProductRoute.ts

import express from "express";

import {
    c_checkoutOrder,
    c_createNewOrderUser,
    c_getAllOrders,
    c_getAllOrdersForUser
} from "../../controllers/Products Controller/ordersProductsController";
import { isAuthorized, IsAuthenticated } from "../../middlewares/isAuthentecated";

const orderProductRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /order
 *  @method        POST
 *  @access        private 
 */
orderProductRoute.post('/order', isAuthorized, c_createNewOrderUser);

/**
 *  @description   Get all orders for a user
 *  @route         /order
 *  @method        GET
 *  @access        private
 */
orderProductRoute.get('/order', IsAuthenticated, c_getAllOrdersForUser);

/**
 *  @description   Get all orders
 *  @route         /orders
 *  @method        GET
 *  @access        admin
 */
orderProductRoute.get('/orders', isAuthorized, c_getAllOrders);

/**
 * @description   Checkout an order
 * @route         /order/:orderId/checkout
 * @method        PUT
 * @access        private
 */
orderProductRoute.put('/order/:orderId/checkout', IsAuthenticated, c_checkoutOrder);

export default orderProductRoute;
