import express from "express"

const productRoute = express.Router();

/**
 *  @description   Create a customization for a product
 *  @route         /ProductCustomization
 *  @method        POST
 *  @access        Public
 */
// productRoute.post('/products/:productId/customizations');
productRoute.post('/ProductCustomization');

/**
 *  @description   Update customization for a product
 *  @route         /ProductCustomization/ProductCustomizationID
 *  @method        PUT
 *  @access        Public
 */
productRoute.put('/ProductCustomization/ProductCustomizationID');


/**
 *  @description   Get all products
 *  @route         /products
 *  @method        GET
 *  @access        Public
 */
productRoute.get('/getAllproducts');

/**
 *  @description   Get a single product by ID
 *  @route         /products/:productId
 *  @method        GET
 *  @access        Public
 */
productRoute.get('/getProduct/:productId');

/**
 *  @description   Create a new product
 *  @route         /products
 *  @method        POST
 *  @access        Public
 */
productRoute.post('/createProduct');

/**
 *  @description   Update a product
 *  @route         /products/:productId
 *  @method        PUT
 *  @access        Public
 */
productRoute.put('/product/:productId');

/**
 *  @description   Delete a product
 *  @route         /products/:productId
 *  @method        DELETE
 *  @access        Public
 */
productRoute.delete('/product/:productId');




export default productRoute;