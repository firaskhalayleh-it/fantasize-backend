import express from "express"
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";

const packageRoute = express.Router();


/**
 *  @description   Create a new package
 *  @route         /packages
 *  @method        POST
 *  @access        admin
 */
packageRoute.post('/packages', authMiddleware, adminMiddleware);

/**
 *  @description   Get all packages
 *  @route         /packages
 *  @method        GET
 *  @access        public
 */
packageRoute.get('/packages');


/**
 *  @description   Get all packages under a specific subcategory
 *  @route         /:categoryId/:subcategoryId/packages
 *  @method        GET
 *  @access        public
 */
packageRoute.get('/:categoryId/:subcategoryId/packages');

/**
 *  @description   Get a package by ID
 *  @route         /packages/:packageId
 *  @method        GET
 *  @access        public
 */
packageRoute.get('/packages/:packageId');

/**
 *  @description   Update a package
 *  @route         /packages/:packageId
 *  @method        PUT
 *  @access        public
 */
packageRoute.put('/packages/:packageId', authMiddleware, adminMiddleware);




export default packageRoute;