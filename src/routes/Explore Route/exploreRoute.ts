//route for explore
import express from 'express';
import { c_getAllVideos } from '../../controllers/Explore Controller/exploreController';
import { IsAuthenticated } from '../../middlewares/isAuthentecated';

const exploreRoute = express.Router();

/**
 *  @description   Get all videos
 *  @route         /explore
 *  @method        GET
 *  @access        public
 */
exploreRoute.get('/explore', c_getAllVideos);

export default exploreRoute;