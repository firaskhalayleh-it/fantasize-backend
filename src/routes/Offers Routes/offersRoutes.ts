import express from 'express';
import { IsAuthenticated, isAuthorized } from '../../middlewares/isAuthentecated';

import {
    c_getOfferByID,
    c_createOfferPackage, c_getAllOffers,
    c_getAllOffersForProduct, c_getAllOffersForPackage,
    c_updateOffer, c_getAllOffersForHomePage,
    c_homeOffers,
    
    c_createNewOffer,
    c_createOfferProduct
} from '../../controllers/Offers Controller/offersController';

const offerRoute = express.Router();

/**
 *  @description   Create a new an offer
 *  @route         /offers
 *  @method        POST
 *  @access        private
 */
offerRoute.post('/addOffer', isAuthorized, c_createNewOffer);



/**
 *  @description   Get all offers
 *  @route         /offers
 *  @method        GET
 *  @access        admin
 */
offerRoute.get('/offers', IsAuthenticated, c_getAllOffers);

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
offerRoute.get('/offers_homeOffers', c_homeOffers);


/**
 *  @description   Create a new offer for a product
 *  @route         /offers/product
 *  @method        POST
 *  @access        private
 */
offerRoute.post('/offers/products', isAuthorized, c_createOfferProduct);


/**
 *  @description   Create a new offer for a package
 *  @route         /offers/package
 *  @method        POST
 *  @access        private
 */
offerRoute.post('/offers/packages', isAuthorized, c_createOfferPackage);

/**
 *  @description   Get all offers for a product
 *  @route         /offers/product/:productId
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers/product/:productId', IsAuthenticated, c_getAllOffersForProduct);


/**
 *  @description   Get all offers for a package
 *  @route         /offers/package/:packageId
 *  @method        GET
 *  @access        public
 */
offerRoute.get('/offers/package/:packageId', IsAuthenticated, c_getAllOffersForPackage);




export default offerRoute;
