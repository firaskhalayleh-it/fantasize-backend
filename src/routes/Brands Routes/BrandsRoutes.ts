import express from 'express';
import { IsAuthenticated } from '../../middlewares/isAuthentecated';
import { c_addNewBrand, c_deleteBrand, c_getAllBrands, c_updateBrand,c_getBrandForProduct } from '../../controllers/Brands Controller/brandsController';

const brandRoute = express.Router();

/**
 *  @description   Add a new brand
 *  @route         /brands
 *  @method        POST
 *  @access        private (admin)
 */
brandRoute.post('/AddBrands' , IsAuthenticated , c_addNewBrand);

/**
 *  @description   Get all brands
 *  @route         /brands
 *  @method        GET
 *  @access        public
 */
brandRoute.get('/brands' , c_getAllBrands);



/**
 *  @description   Update a brand
 *  @route         /brands/:brandId
 *  @method        PUT
 *  @access        private (admin)
 */
brandRoute.put('/brands/:brandId' , IsAuthenticated,c_updateBrand);

/**
 *  @description   Delete a brand
 *  @route         /brands/:brandId
 *  @method        DELETE
 *  @access        private (admin)
 */
brandRoute.delete('/brands/:brandId',IsAuthenticated , c_deleteBrand);

/**
 *  @description   Get brand for product
 *  @route         /brands/:brandId
 *  @method        GET
 *  @access        public
 */
brandRoute.get('/brands/:brandId', c_getBrandForProduct);

export default brandRoute;
