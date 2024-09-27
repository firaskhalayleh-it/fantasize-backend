import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { adminMiddleware } from '../../middlewares/admin_middleware';

const offerRoute = express.Router();

/**
 *  @description   Create a new offer
 *  @route         /offers
 *  @method        POST
 *  @access        private
 */
offerRoute.post('/offers',authMiddleware,adminMiddleware );

/**
 *  @description   Get all offers
 *  @route         /offers
 *  @method        GET
 *  @access        admin
 */
offerRoute.get('/offers',authMiddleware,adminMiddleware );

/**
 *  @description   Get an offer by ID
 *  @route         /offers/:offerId
 *  @method        GET
 *  @access        admin
 */
offerRoute.get('/offers/:offerId',authMiddleware,adminMiddleware );

/**
 *  @description   Update an offer
 *  @route         /offers/:offerId
 *  @method        PUT
 *  @access        admin
 */
offerRoute.put('/offers/:offerId',authMiddleware,adminMiddleware );





/**
 *  @description   Get all offers for the home page for mobile version and web version
 *  @route         /offers/homeOffers
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers/homeOffers' );

export default offerRoute;
