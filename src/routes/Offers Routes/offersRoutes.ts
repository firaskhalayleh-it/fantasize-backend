import express from 'express';

const offerRoute = express.Router();

/**
 *  @description   Create a new offer
 *  @route         /offers
 *  @method        POST
 *  @access        private
 */
offerRoute.post('/offers', );

/**
 *  @description   Get all offers (مش عارف اذا هاي بتلزمنا)
 *  @route         /offers
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers', );

/**
 *  @description   Get an offer by ID
 *  @route         /offers/:offerId
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers/:offerId', );

/**
 *  @description   Update an offer
 *  @route         /offers/:offerId
 *  @method        PUT
 *  @access        private
 */
offerRoute.put('/offers/:offerId',);

/**
 *  @description   Delete an offer
 *  @route         /offers/:offerId
 *  @method        DELETE
 *  @access        private
 */
offerRoute.delete('/offers/:offerId',);

export default offerRoute;
