// src/routes/orderProductRoute.ts

import express from "express";

import {
    c_createNewOrderUser,
    c_deleteOrderProduct,
    c_updateOrderProduct
} from "../../controllers/Products Controller/ordersProductsController";
import { isAuthorized, IsAuthenticated } from "../../middlewares/isAuthentecated";
import { uploadSingle } from "../../middlewares/multerMiddleware";

const orderProductRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /order
 *  @method        POST
 *  @access        private 
 */
orderProductRoute.post('/order', IsAuthenticated, c_createNewOrderUser);

/**
 *  @description   Update a specific product order
 *  @route         /order/:orderId
 *  @method        PUT
 *  @access        private
 */
orderProductRoute.put('/order/:orderId/:productId', isAuthorized, c_updateOrderProduct);


/**
 *  @description   Delete a specific product order
 *  @route         /order/:orderId/:productId
 *  @method        DELETE
 *  @access        private
 */

orderProductRoute.delete('/order/:orderId/:productId', isAuthorized, c_deleteOrderProduct);


export default orderProductRoute;
