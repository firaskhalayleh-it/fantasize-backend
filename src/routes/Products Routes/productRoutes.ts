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

productRoute.get('/:CategoryID/:subCategoryID/getAllproducts', IsAuthenticated, c_getProductByCategoryAndSubCategory);

/**
 *  @description   Get a single product by ID
 *  @route         /products/:productId
 *  @method        GET
 *  @access        Public
 */
productRoute.get('/getProduct/:id', IsAuthenticated, c_getProduct);

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












export default productRoute;