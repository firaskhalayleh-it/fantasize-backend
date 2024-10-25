
import express from 'express';

import { IsAuthenticated } from '../../middlewares/isAuthentecated';
import { c_createNewOrderUser, c_deleteorderPackage, c_updateOrderPackage } from '../../controllers/Packages Controller/ordersPackagesController';

const orderPackageRoute = express.Router();

/**
 *  @description   Create a new order for a user
 *  @route         /orderpackage
 *  @method        POST
 *  @access        private 
 */
orderPackageRoute.post('/orderpackage',IsAuthenticated,c_createNewOrderUser);

/**
 *  @description   Update a specific package order
 *  @route         /orderpackage/:orderId/:packageId
 *  @method        PUT
 *  @access        private
 */
orderPackageRoute.put('/orderpackage/:orderId/:packageId',IsAuthenticated,c_updateOrderPackage);

/**
 * @description   Delete a specific package order
 * @route         /orderpackage/:orderId/:packageId
 * @method        DELETE
 * @access        private
 * 
    */
orderPackageRoute.delete('/orderpackage/:orderId/:packageId',IsAuthenticated,c_deleteorderPackage);


export default orderPackageRoute;