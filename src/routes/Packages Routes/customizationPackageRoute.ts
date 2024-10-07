// package customizations routes

import { Router } from 'express';
import { c_assignCustomizationToPackage, c_createCustomizationPackage, c_deleteCustomizationPackage, c_getAllCustomizationPackages, c_updateCustomizationPackage } from '../../controllers/Packages Controller/packagesCustomizationsController';
import { IsAuthenticated } from '../../middlewares/isAuthentecated';

const customizationPackageRoute = Router();

/**
 * @description   Create a new customization for a package
 * @route         /customizationpackage
 * @method        POST
 * @access        private
 */
customizationPackageRoute.post('/customizationpackage', IsAuthenticated, c_createCustomizationPackage);


/**
 * @description   Get all customizations for a package
 * @route         /customizationpackage
 * @method        GET
 * @access        private
 */
customizationPackageRoute.get('/customizationpackage', IsAuthenticated, c_getAllCustomizationPackages);

/**
 * @description   Update a package customization
 * @route         /customizationpackage/:customizationId
 * @method        PUT
 * @access        private
 */
customizationPackageRoute.put('/customizationpackage/:customizationId', IsAuthenticated, c_updateCustomizationPackage);


/**
 * @description   Assign a customization to a package
 * @route         /customizationpackage/:packageId/:customizationId
 * @method        PUT
 * @access        private
 */
customizationPackageRoute.put('/customizationpackage/:packageId/:customizationId', IsAuthenticated, c_assignCustomizationToPackage);


/**
 * @description   Delete a package customization
 * @route         /customizationpackage/:customizationId
 * @method        DELETE
 * @access        private
 */
customizationPackageRoute.delete('/customizationpackage/:customizationId', IsAuthenticated, c_deleteCustomizationPackage);


export default customizationPackageRoute;