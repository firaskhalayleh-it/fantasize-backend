import express from "express"

import { IsAuthenticated, isAuthorized } from "../../middlewares/isAuthentecated";
import { c_createProduct, c_getProduct, c_getProductByCategoryAndSubCategory,
     c_updateProduct, c_getAllProducts, c_getProductByCategoryID, 
     c_getRandomMenProducts, c_getRandomWomenProducts ,c_deleteProduct,c_getLastProduct} from "../../controllers/Products Controller/productController";
import FavoriteProductRoute from "./favoriteProductsRoutes";
import { uploadFields } from "../../middlewares/multerMiddleware";
import { cacheMiddleware, cacheConfigs, invalidateCache, invalidationPatterns } from "../../middlewares/cacheMiddleware";

const productRoute = express.Router();


/**
 *  @description   Get all products 
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */

productRoute.get('/GetAllProducts', IsAuthenticated, cacheMiddleware(cacheConfigs.products), c_getAllProducts);



/**
 *  @description   Get all products by subcategory
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */

productRoute.get('/:CategoryID/:subCategoryID/getAllproducts', cacheMiddleware(cacheConfigs.products), c_getProductByCategoryAndSubCategory);

/**
 *  @description   Get a single product by ID
 *  @route         /products/:productId
 *  @method        GET
 *  @access        Public
 */
productRoute.get('/getProduct/:id', cacheMiddleware(cacheConfigs.products), c_getProduct);

/**
 *  @description   Create a new product
 *  @route         /createProduct
 *  @method        POST
 *  @access        admin
 */
productRoute.post('/createProduct', isAuthorized, uploadFields, invalidateCache(invalidationPatterns.products), c_createProduct);

/**
 *  @description   Update a product
 *  @route         /products/:productId
 *  @method        PUT
 *  @access        admin
 */
productRoute.put('/product/:productId', isAuthorized, uploadFields, invalidateCache(invalidationPatterns.products), c_updateProduct);


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
productRoute.get('/products', cacheMiddleware(cacheConfigs.products), c_getAllProducts);

/**
 *  @description   Get all products by category
 *  @route         /products/:CategoryID
 *  @method
 * @access        Public
 * 
    * 
        */

productRoute.get('/products/:CategoryID', cacheMiddleware(cacheConfigs.products), c_getProductByCategoryID);


/**
 *  @description   Get random products for men
 * @route        /products/random/men
 * @method      GET
 * @access     public
*/
productRoute.get('/products/random/men', cacheMiddleware(cacheConfigs.products), c_getRandomMenProducts);

/**
 *  @description   Get random products for women
 *  @route       /products/random/women
 * @method      GET
 * @access     public
*/
productRoute.get('/products/random/women', cacheMiddleware(cacheConfigs.products), c_getRandomWomenProducts);



/**
 *  @description   Delete a product
 *  @route         /products/:productId
 *  @method        DELETE
 *  @access        admin
 */
productRoute.delete('/products/:productId', isAuthorized, invalidateCache(invalidationPatterns.products), c_deleteProduct);

/**
 *  @description   Get last product
 *  @route         /products/last
 *  @method        GET
 *  @access        public
 */
productRoute.get('/last/product', cacheMiddleware(cacheConfigs.products), c_getLastProduct);







export default productRoute;