import express from 'express';

import { isAuthorized } from '../../middlewares/isAuthentecated';

import {
    c_getOfferByID, c_createOfferProduct,
    c_createOfferPackage, c_getAllOffers,
    c_getAllOffersForProduct, c_getAllOffersForPackage,
    c_updateOffer, c_getAllOffersForHomePage
} from '../../controllers/Offers Controller/offersController';
import { s_homeOffers } from '../../services/Offers Services/offersServices';

const offerRoute = express.Router();

/**
 *  @description   Create a new offer
 *  @route         /offers
 *  @method        POST
 *  @access        private
 */
offerRoute.post('/offers', isAuthorized, c_createOfferProduct);

/**
 *  @description   Get all offers
 *  @route         /offers
 *  @method        GET
 *  @access        admin
 */
offerRoute.get('/offers', isAuthorized, c_getAllOffers);

/**
 *  @description   Get an offer by ID
 *  @route         /offers/:offerId
 *  @method        GET
 *  @access        admin
 */
offerRoute.get('/offers/:offerId', isAuthorized, c_getOfferByID);

/**
 *  @description   Update an offer
 *  @route         /offers/:offerId
 *  @method        PUT
 *  @access        admin
 */
offerRoute.put('/offers/:offerId', isAuthorized, c_updateOffer);





/**
 *  @description   Get all offers for the home page for mobile version and web version
 *  @route         /offers/homeOffers
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers/homeOffers', isAuthorized, s_homeOffers);


// /**
//  *  @description   Create a new offer for a product
//  *  @route         /offers/product
//  *  @method        POST
//  *  @access        private
//  */
// offerRoute.post('/offers/product', isAuthorized, c_createOfferProduct);


/**
 *  @description   Create a new offer for a package
 *  @route         /offers/package
 *  @method        POST
 *  @access        private
 */
offerRoute.post('/offers/package', isAuthorized, c_createOfferPackage);

/**
 *  @description   Get all offers for a product
 *  @route         /offers/product/:productId
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers/product/:productId', isAuthorized, c_getAllOffersForProduct);


/**
 *  @description   Get all offers for a package
 *  @route         /offers/package/:packageId
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers/package/:packageId', isAuthorized, c_getAllOffersForPackage);




export default offerRoute;
