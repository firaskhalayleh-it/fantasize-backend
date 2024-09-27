import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';


const customizationPackageRoute = express.Router();

/**
 *  @description   Create a new customization package
 *  @route         /customizationPackages
 *  @method        POST
 *  @access        admin
 */
customizationPackageRoute.post('/customizationPackages', authMiddleware, adminMiddleware);

/**
 *  @description   Get all customization packages
 *  @route         /customizationPackages
 *  @method        GET
 *  @access        public
 */
customizationPackageRoute.get('/customizationPackages');


/**
 *  @description   Update a customization package
 *  @route         /customizationPackages/:customizationPackageId
 *  @method        PUT
 *  @access        public
 */
customizationPackageRoute.put('/customizationPackages/:customizationPackageId', authMiddleware, adminMiddleware);

export default customizationPackageRoute;