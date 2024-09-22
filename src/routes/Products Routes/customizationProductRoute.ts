import express from 'express';

import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';

const customizationProductRoute = express.Router();

/**
 *  @description   Create a new customization product
 *  @route         /customizationProducts
 *  @method        POST
 *  @access        admin
 */
customizationProductRoute.post('/customizationProducts', authMiddleware, adminMiddleware);


/**
 *  @description   Get all customization products
 *  @route         /customizationProducts
 *  @method        GET
 *  @access        public
 */
customizationProductRoute.get('/customizationProducts');


/**
 *  @description   Update a customization product
 *  @route         /customizationProducts/:customizationProductId
 *  @method        PUT
 *  @access        public
 */
customizationProductRoute.put('/customizationProducts/:customizationProductId', authMiddleware, adminMiddleware);

export default customizationProductRoute;