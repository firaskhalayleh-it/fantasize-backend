// material route

import express from 'express';
import {
    c_createMaterial, c_deleteMaterial, c_getMaterialById, c_getMaterials, c_updateMaterial
    , c_assignMaterialsToPackage, c_assignMaterialsToProduct, c_getMaterialsForProduct
    , c_getProductsForMaterial, c_unassignMaterialsFromPackage, c_unassignMaterialsFromProduct
    , c_updateMaterialsForPackage, c_updateMaterialsForProduct,c_getMaterialsForPackage
} from '../../controllers/Material Controllers/MaterialController';
import { IsAuthenticated, isAuthorized } from '../../middlewares/isAuthentecated';

const materialRoutes = express.Router();

/**
 * @description   Create a new material
 * @route         POST /material
 * @access        Private
 */
materialRoutes.post('/material', isAuthorized, c_createMaterial);

/**
 * @description   Get all materials
 * @route         GET /material
 * @access        Private
 */
materialRoutes.get('/material', isAuthorized, c_getMaterials);

/**
 * @description   Get a material by ID
 * @route         GET /material/:id
 * @access        Private
 */
materialRoutes.get('/material/:id', isAuthorized, c_getMaterialById);

/**
 * @description   Update a material
 * @route         PUT /material/:id
 * @access        Private
 */
materialRoutes.put('/material/:id', isAuthorized, c_updateMaterial);

/**
 * @description   Delete a material
 * @route         DELETE /material/:id
 * @access        Private
 */

materialRoutes.delete('/material/:id', isAuthorized, c_deleteMaterial);

/**
 * @description   Assign materials to a package
 * @route         POST /material/package
 * @access        Private
 */
materialRoutes.post('/package', isAuthorized, c_assignMaterialsToPackage);

/**
 * @description   Assign materials to a product
 * @route         POST /material/product
 * @access        Private
 */
materialRoutes.post('/product/assign', isAuthorized, c_assignMaterialsToProduct);

/**
 * @description   Get materials for a product
 * @route         GET /material/product/:id
 * @access        Private
 */
materialRoutes.get('/product/:ProductID', IsAuthenticated, c_getMaterialsForProduct);


/**
 * @description   Unassign materials from a package
 * @route         /package/delete
 * @access        Private
 */
materialRoutes.delete('/package/delete', isAuthorized, c_unassignMaterialsFromPackage);

/**
 * @description   Unassign materials from a product
 * @route         /product/delete
 * @access        Private
 */
materialRoutes.delete('/product/delete', isAuthorized, c_unassignMaterialsFromProduct);

/**
 * @description   Update materials for a package
 * @route         PUT /material/package/:id
 * @access        Private
 */
materialRoutes.put('/package/update', isAuthorized, c_updateMaterialsForPackage);

/**
 * @description   Update materials for a product
 * @route         PUT /material/product/:id
 * @access        Private
 */
materialRoutes.put('/product/update', isAuthorized, c_updateMaterialsForProduct);

/**
 * @description   Get materials for a package
 * @route         GET /package/:PackageID
 * @access        Private
 */
materialRoutes.get('/package/:PackageID', IsAuthenticated, c_getMaterialsForPackage);





export default materialRoutes;
