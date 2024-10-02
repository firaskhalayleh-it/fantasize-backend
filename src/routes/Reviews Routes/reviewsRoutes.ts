import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { c_createReviewPackage, c_createReviewProduct, c_deleteReview, c_getAllReviewsPackage, c_getAllReviewsProduct } from '../../controllers/Reviews Controller/reviewsController';
const reviewsRoute = express.Router();

/**
 *  @description   Create a new review for a product
 *  @route         /reviews/product
 *  @method        POST
 *  @access        private
 */
reviewsRoute.post('/reviews/product', authMiddleware, c_createReviewProduct);


/**
 *  @description   Create a new review for a package
 *  @route         /reviews/package
 *  @method        POST
 *  @access        private
 */
reviewsRoute.post('/reviews/package', authMiddleware, c_createReviewPackage);


/**
 *  @description   Get all reviews for a product
 *  @route         /reviews/product
 *  @method        GET
 *  @access        private
 */
reviewsRoute.get('/reviews/product', authMiddleware, c_getAllReviewsProduct);


/**
 *  @description   Get all reviews for a package
 *  @route         /reviews/package
 *  @method        GET
 *  @access        private
 */
reviewsRoute.get('/reviews/package', authMiddleware, c_getAllReviewsPackage);


/**
 *  @description   Delete a review
 *  @route         /reviews/:reviewId
 *  @method        DELETE
 *  @access        private
 */
reviewsRoute.delete('/reviews/:reviewId', authMiddleware, c_deleteReview);




export default reviewsRoute;
