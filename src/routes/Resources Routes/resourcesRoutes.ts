import express from 'express';

const resourceRoute = express.Router();

/**
 *  @description   Create a new resource
 *  @route         /resources
 *  @method        POST
 *  @access        private
 */
resourceRoute.post('/');

/**
 *  @description   Get all resources
 *  @route         /resources
 *  @method        GET
 *  @access        public
 */
resourceRoute.get('/');

export default resourceRoute;
