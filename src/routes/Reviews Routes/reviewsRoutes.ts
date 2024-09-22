import express from 'express';

const reviewsRoute = express.Router();

/**
 *  @description   Create a new review for a product or package
 *  @route          /reviews
 *  @method        POST
 *  @access        private 
 */
reviewsRoute.post('/',);

/**
 *  @description   Update an existing review 
 *  @route         /reviews/:id
 *  @method        PUT
 *  @access        private 
 */
reviewsRoute.put('/:id',);

export default reviewsRoute;
