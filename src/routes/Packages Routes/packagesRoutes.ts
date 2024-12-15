import express from "express"
import { isAuthorized } from "../../middlewares/isAuthentecated";
import { c_createPackage, c_getAllPackages, c_getAllPackagesUnderSpecificSubcategory,
     c_getPackageByID, c_updatePackage ,c_getRandomPackages,c_getRandomPackagesMen
    ,c_getLastPackage} from "../../controllers/Packages Controller/packagesController";
import { uploadFields } from "../../middlewares/multerMiddleware";

const packageRoute = express.Router();


/**
 *  @description   Create a new package
 *  @route         /packages
 *  @method        POST
 *  @access        admin
 */
packageRoute.post('/packages', isAuthorized, uploadFields, c_createPackage);

/**
 *  @description   Get all packages
 *  @route         /packages
 *  @method        GET
 *  @access        public
 */
packageRoute.get('/packages', c_getAllPackages);


/**
 *  @description   Get all packages under a specific subcategory
 *  @route         /:categoryId/:subcategoryId/packages
 *  @method        GET
 *  @access        public
 */
packageRoute.get('/:categoryId/:subcategoryId/packages', c_getAllPackagesUnderSpecificSubcategory);

/**
 *  @description   Get a package by ID
 *  @route         /packages/:packageId
 *  @method        GET
 *  @access        public
 */
packageRoute.get('/packages/:packageId', c_getPackageByID);

/**
 *  @description   Update a package
 *  @route         /packages/:packageId
 *  @method        PUT
 *  @access        private (admin)
 */
packageRoute.put('/packages/:packageId', isAuthorized,uploadFields, c_updatePackage);

/**
 *  @description   Get random packages for women
 *  @route         /packages/random/women
 *  @method        GET
 *  @access        public
 */
packageRoute.get('/packages/random/women', c_getRandomPackages);

/**
 *  @description   Get random packages for men 
 * @route         /packages/random/men
 * @method        GET
 * @access        public
 * 
 * 
    */
packageRoute.get('/packages/random/men', c_getRandomPackagesMen);

/**
 *  @description   Get last package
 * @route         /last/package
 * @method        GET
 * @access        public
 */

packageRoute.get('/last/package', c_getLastPackage);


export default packageRoute;