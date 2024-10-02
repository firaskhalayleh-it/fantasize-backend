import express from 'express';
import { isAuthorized } from '../../middlewares/isAuthentecated';
import { c_addNewBrand, c_deleteBrand, c_getAllBrands, c_updateBrand } from '../../controllers/Brands Controller/brandsController';

const brandRoute = express.Router();

/**
 *  @description   Add a new brand
 *  @route         /brands
 *  @method        POST
 *  @access        private (admin)
 */
brandRoute.post('/AddBrands' , isAuthorized , c_addNewBrand);

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
brandRoute.put('/brands/:brandId' , isAuthorized,c_updateBrand);

/**
 *  @description   Delete a brand
 *  @route         /brands/:brandId
 *  @method        DELETE
 *  @access        private (admin)
 */
brandRoute.delete('/brands/:brandId',isAuthorized , c_deleteBrand);

export default brandRoute;
