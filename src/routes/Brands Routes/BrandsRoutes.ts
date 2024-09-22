import express from 'express';

const brandRoute = express.Router();

/**
 *  @description   Add a new brand
 *  @route         /brands
 *  @method        POST
 *  @access        private
 */
brandRoute.post('/AddBrands');

/**
 *  @description   Get all brands
 *  @route         /brands
 *  @method        GET
 *  @access        public
 */
brandRoute.get('/brands');

/**
 *  @description   Get a brand by ID
 *  @route         /brands/:brandId
 *  @method        GET
 *  @access        public
 */
brandRoute.get('/brands/:brandId');

/**
 *  @description   Update a brand
 *  @route         /brands/:brandId
 *  @method        PUT
 *  @access        private
 */
brandRoute.put('/brands/:brandId');

/**
 *  @description   Delete a brand
 *  @route         /brands/:brandId
 *  @method        DELETE
 *  @access        private
 */
brandRoute.delete('/brands/:brandId');

export default brandRoute;
