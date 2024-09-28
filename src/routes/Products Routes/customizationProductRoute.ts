import express from 'express';

import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';
import { isAuthorized } from '../../middlewares/isAuthentecated';
import { c_createCustomizationProduct, c_getAllCustomizationProducts, c_updateCustomizationProduct } from '../../controllers/Products Controller/productCustomizationsController';

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
customizationProductRoute.get('/customizationProducts',c_getAllCustomizationProducts);


/**
 *  @description   Update a customization product
 *  @route         /customizationProducts/:customizationProductId
 *  @method        PUT
 *  @access        admin
 */
customizationProductRoute.put('/customizationProducts/:customizationProductId', isAuthorized,c_updateCustomizationProduct);

export default customizationProductRoute;