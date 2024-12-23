// src/routes/orderProductRoute.ts

import express from "express";

import {
    c_createNewOrderUser,
    c_deleteOrderProduct,
    c_updateOrderProduct,
    c_getOrderProductById
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
orderProductRoute.put('/orderproduct/:orderProductId', IsAuthenticated, c_updateOrderProduct);



/**
 *  @description   Delete a specific product order
 *  @route         /order/:orderId/:productId
 *  @method        DELETE
 *  @access        private
 */

orderProductRoute.delete('/orderproduct/:orderProductId', IsAuthenticated, c_deleteOrderProduct);




/**
 *  @description   Get a specific product order
 *  @route         /order/:orderId/:productId
 *  @method        GET
 *  @access        private
 */
orderProductRoute.get('/orderproduct/:orderProductId', IsAuthenticated, c_getOrderProductById);


export default orderProductRoute;
