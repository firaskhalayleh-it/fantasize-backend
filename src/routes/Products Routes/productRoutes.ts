import express from "express"
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";
import { isAuthorized } from "../../middlewares/isAuthentecated";
import { c_createProduct, c_getProduct, c_getProductByCategoryAndSubCategory, c_updateProduct } from "../../controllers/Products Controller/productController";

const productRoute = express.Router();





/**
 *  @description   Get all products by subcategory
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */

productRoute.get('/:CategoryID/:subCategoryID/getAllproducts',isAuthorized,c_getProductByCategoryAndSubCategory);

/**
 *  @description   Get a single product by ID
 *  @route         /products/:productId
 *  @method        GET
 *  @access        Public
 */
productRoute.get('/getProduct/:productId',isAuthorized,c_getProduct);

/**
 *  @description   Create a new product
 *  @route         /createProduct
 *  @method        POST
 *  @access        admin
 */
productRoute.post('/createProduct',isAuthorized,c_createProduct);

/**
 *  @description   Update a product
 *  @route         /products/:productId
 *  @method        PUT
 *  @access        admin
 */
productRoute.put('/product/:productId',isAuthorized,c_updateProduct);












export default productRoute;