//route of customization
import express from 'express';
import {
    c_assignCustomizationToPackage, c_assignCustomizationToProduct, c_createCustomization, c_getAllCustomizations,
    c_getCustomizationById, c_removeCustomizationFromPackage, c_removeCustomizationFromProduct, c_updateCustomization,
    c_deleteCustomization
} from '../../controllers/Customizations Controller/customizationController';
import { IsAuthenticated, isAuthorized } from '../../middlewares/isAuthentecated';

import { uploadDynamic, uploadFields, uploadMultiple, uploadSingle } from '../../middlewares/multerMiddleware';

const customizationRoute = express.Router();
/**
 *  @description    Create customization
 *  @route          /customization
 *  @method         post
 *  @access         private
 */
customizationRoute.post('/customization', IsAuthenticated, isAuthorized, uploadDynamic, c_createCustomization);


/**
 *  @description    Get all customizations
 *  @route          /customization
 *  @method         get
 *  @access         private
 */
customizationRoute.get('/customization', IsAuthenticated, isAuthorized, c_getAllCustomizations);

/**
 *  @description    Update customization
 *  @route          /customization/:id
 *  @method         put
 *  @access         private
 */
customizationRoute.put('/customization/:id', IsAuthenticated, isAuthorized, uploadDynamic, c_updateCustomization);

/**
 *  @description    Assign customization to product
 *  @route          /customization/product
 *  @method         post
 *  @access         private
 */
customizationRoute.post('/customization/product', IsAuthenticated, isAuthorized, c_assignCustomizationToProduct);

/**
 *  @description    Assign customization to package
 *  @route          /customization/package
 *  @method         post
 *  @access         private
 */
customizationRoute.post('/customization/package', IsAuthenticated, isAuthorized, c_assignCustomizationToPackage);

/**
 *  @description    Remove customization from product
 *  @route          /customization/product
 *  @method         delete
 *  @access         private
 */
customizationRoute.delete('/customization/product', IsAuthenticated, isAuthorized, c_removeCustomizationFromProduct);

/**
 *  @description    Remove customization from package
 *  @route          /customization/package
 *  @method         delete
 *  @access         private
 */
customizationRoute.delete('/customization/package', IsAuthenticated, isAuthorized, c_removeCustomizationFromPackage);







/** 
 *   @description Get customization by id
 *   @route /customization/:id
 *   @method get
 *   @access private
 *      
*/

customizationRoute.get('/customization/:id', isAuthorized, c_getCustomizationById);


/**
 *  @description    Delete customization
 *  @route          /customization/:id
 *  @method         delete
 *  @access         private
 */
customizationRoute.delete('/customization/:id', isAuthorized, c_deleteCustomization);





export default customizationRoute;


