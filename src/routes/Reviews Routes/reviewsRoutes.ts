import express from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';

const reviewsRoute = express.Router();

/**
 *  @description   Create a new review for a product or package
 *  @route          /reviews
 *  @method        POST
 *  @access        private 
 */
reviewsRoute.post('/addReview',authMiddleware);

/**
 *  @description   Update an existing review 
 *  @route         /reviews/:id
 *  @method        PUT
 *  @access        private 
 */
reviewsRoute.put('/:id', authMiddleware);


/**
 *  @description   Get all reviews for a product or package
 *  @route         /reviews
 *  @method        GET
 *  @access        public
 */
reviewsRoute.get('/getAllReviews',authMiddleware);

export default reviewsRoute;
