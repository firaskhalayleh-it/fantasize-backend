<<<<<<< HEAD
import express from "express"

import { IsAuthenticated, isAuthorized } from "../../middlewares/isAuthentecated";
import { c_createProduct, c_getProduct, c_getProductByCategoryAndSubCategory, c_updateProduct } from "../../controllers/Products Controller/productController";
import FavoriteProductRoute from "./favoriteProductsRoutes";
import { uploadFields } from "../../middlewares/multerMiddleware";

const productRoute = express.Router();





/**
 *  @description   Get all products by subcategory
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */

productRoute.get('/:CategoryID/:subCategoryID/getAllproducts', c_getProductByCategoryAndSubCategory);

/**
 *  @description   Get a single product by ID
 *  @route         /products/:productId
 *  @method        GET
 *  @access        Public
 */
productRoute.get('/getProduct/:id', c_getProduct);

/**
 *  @description   Create a new product
 *  @route         /createProduct
 *  @method        POST
 *  @access        admin
 */
productRoute.post('/createProduct', isAuthorized,uploadFields, c_createProduct);

/**
 *  @description   Update a product
 *  @route         /products/:productId
 *  @method        PUT
 *  @access        admin
 */
productRoute.put('/product/:productId', isAuthorized, c_updateProduct);


/**
 * @description  Add a product to favorites
 * @route        /product/:productId/favorites*
 * @method      Get, Post, Delete (add, remove, get all) means use
 * @access     private
 *  */
productRoute.use('/product/:productId', FavoriteProductRoute);












=======
import express from "express"
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";
import { isAuthorized } from "../../middlewares/isAuthentecated";
import { c_createProduct, c_getAllProducts, c_getProduct, c_getProductByCategoryAndSubCategory, c_singleProduct, c_updateProduct } from "../../controllers/Products Controller/productController";
import FavoriteProductRoute from "./favoriteProductsRoutes";
import { uploadFields } from "../../middlewares/multerMiddleware";

const productRoute = express.Router();


/**
 *  @description   Get all products 
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */

productRoute.get('/GetAllProducts', isAuthorized, c_getAllProducts);



/**
 *  @description   Get all products by subcategory
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */

productRoute.get('/:CategoryID/:subCategoryID/getAllproducts', isAuthorized, c_getProductByCategoryAndSubCategory);

/**
 *  @description   Get a single product by ID
 *  @route         /products/:productId
 *  @method        GET
 *  @access        Public
 */
productRoute.get('/getProduct/:id', isAuthorized, c_getProduct);

/**
 *  @description   Create a new product
 *  @route         /createProduct
 *  @method        POST
 *  @access        admin
 */
productRoute.post('/createProduct', isAuthorized,uploadFields, c_createProduct);

/**
 *  @description   Update a product
 *  @route         /products/:productId
 *  @method        PUT
 *  @access        admin
 */
productRoute.put('/product/:productId', isAuthorized,uploadFields, c_updateProduct);


/**
 * @description  Add a product to favorites
 * @route        /product/:productId/favorites*
 * @method      Get, Post, Delete (add, remove, get all) means use
 * @access     private
 *  */
productRoute.use('/product/:productId', FavoriteProductRoute);






/**
 *  @description   Get all products 
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */

productRoute.delete('/deleteSingleProduct', isAuthorized, c_singleProduct);





>>>>>>> a32a75d5ed1c9558a43001597d8685ae43ef2c5c
export default productRoute;