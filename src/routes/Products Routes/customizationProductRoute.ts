import express from 'express';

import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';
import { isAuthorized } from '../../middlewares/isAuthentecated';
import { c_assignCustomizationProduct, c_createCustomizationProduct, c_deleteCustomizationProduct, c_getAllCustomizationProducts, c_updateCustomizationProduct } from '../../controllers/Products Controller/productCustomizationsController';

const customizationProductRoute = express.Router();

/**
 *  @description   Create a new customization product
 *  @route         /customizationProducts
 *  @method        POST
 *  @access        admin
 */
customizationProductRoute.post('/customizationProducts', isAuthorized , c_createCustomizationProduct);


/**
 *  @description   Get all customization products
 *  @route         /customizationProducts
 *  @method        GET
 *  @access        public
 */
customizationProductRoute.get('/customizationProducts',isAuthorized,c_getAllCustomizationProducts);


/**
 *  @description   Update a customization product
 *  @route         /customizationProducts/:customizationProductId
 *  @method        PUT
 *  @access        admin
 */
customizationProductRoute.put('/customizationProducts/:customizationId', isAuthorized,c_updateCustomizationProduct);

/**
 * @description   Delete a customization product
 * @route         /customizationProducts/:customizationId
 * @method        DELETE
 * @access        admin
 * 
 *    */
customizationProductRoute.delete('/customizationProducts/:customizationId',isAuthorized,c_deleteCustomizationProduct);


/**
 * @description  Assign a product to a customization product
 * @route        /customizationProducts/:customizationId/:productId
 * @method      PUT
 * @access      admin
 * 
 */

customizationProductRoute.put('/customizationProducts/:customizationId/:productId',isAuthorized,c_assignCustomizationProduct);

export default customizationProductRoute;