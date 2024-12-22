import express from 'express';
import { c_getNewArrivals, c_getRecommendedForYou } from '../../controllers/Home Controllers/home_controller';
import { IsAuthenticated, isAuthorized } from '../../middlewares/isAuthentecated';
const homeRoute = express.Router();
//----------------------- get new arrivals -----------------------
/** 
* @route /newArrivals
* @method GET
* @access public
* @description get new arrivals
* */

homeRoute.get('/newArrivals', c_getNewArrivals);


//----------------------- get recommended for you -----------------------
/**
 * @description   Get recommended products for the user
 * @route         /recommendedForYou
 * @method        GET
 * @access        public
 */

homeRoute.get('/recommendedForYou',isAuthorized, c_getRecommendedForYou);

export default homeRoute;