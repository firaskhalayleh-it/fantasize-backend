import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { c_createReviewPackage, c_createReviewProduct, c_deleteReview, c_getAllReviewsPackage, c_getAllReviewsProduct, c_updateReview } from '../../controllers/Reviews Controller/reviewsController';
import { IsAuthenticated } from '../../middlewares/isAuthentecated';
const reviewsRoute = express.Router();

/**
 *  @description   Create a new review for a product
 *  @route         /reviews/product
 *  @method        POST
 *  @access        private
 */
reviewsRoute.post('/reviews/product', IsAuthenticated, c_createReviewProduct);


/**
 *  @description   Create a new review for a package
 *  @route         /reviews/package
 *  @method        POST
 *  @access        private
 */
reviewsRoute.post('/reviews/package', IsAuthenticated, c_createReviewPackage);


/**
 *  @description   Get all reviews for a product
 *  @route         /reviews/product
 *  @method        GET
 *  @access        private
 */
reviewsRoute.get('/reviews/product', IsAuthenticated, c_getAllReviewsProduct);


/**
 *  @description   Get all reviews for a package
 *  @route         /reviews/package
 *  @method        GET
 *  @access        private
 */
reviewsRoute.get('/reviews/package', IsAuthenticated, c_getAllReviewsPackage);


/**
 *  @description   Delete a review
 *  @route         /reviews/:reviewId
 *  @method        DELETE
 *  @access        private
 */
reviewsRoute.delete('/reviews/:reviewId', IsAuthenticated, c_deleteReview);

/**
 *  @description   Update a review
 *  @route         /reviews/:reviewId
 *  @method        update
 *  @access        private
 */
reviewsRoute.put('/reviews/:reviewId', IsAuthenticated, c_updateReview);

export default reviewsRoute;
