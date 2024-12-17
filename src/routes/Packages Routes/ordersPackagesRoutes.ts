
import express from 'express';

import { IsAuthenticated } from '../../middlewares/isAuthentecated';
import { c_createNewOrderUser, c_deleteorderPackage, c_updateOrderPackage, c_getOrderPackage } from '../../controllers/Packages Controller/ordersPackagesController';
import { uploadSingle } from '../../middlewares/multerMiddleware';

const orderPackageRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /orderpackage
 *  @method        POST
 *  @access        private 
 */
orderPackageRoute.post('/orderpackage', IsAuthenticated, c_createNewOrderUser);

/**
 *  @description   Update a specific package order
 *  @route         /orderpackage/:orderId/:packageId
 *  @method        PUT
 *  @access        private
 */
orderPackageRoute.put('/orderpackage/:orderPackageId', IsAuthenticated,uploadSingle, c_updateOrderPackage);

/**
 * @description   Delete a specific package order
 * @route         /orderpackage/:orderId/:packageId
 * @method        DELETE
 * @access        private
 * 
    */
orderPackageRoute.delete('/orderpackage/:orderId/:orderPackageId', IsAuthenticated, c_deleteorderPackage);


/**
 * @description   Get a specific package order
 * @route         /orderpackage/:orderId/:packageId
 * @method        GET
 * @access        private
 * 
*/
orderPackageRoute.get('/orderpackage/:orderPackageId', IsAuthenticated, c_getOrderPackage);


export default orderPackageRoute;