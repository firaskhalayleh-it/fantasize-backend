import { Router } from 'express';
import { c_searchUser, c_search, c_searchOrder } from '../../controllers/search Controller/searchController';
import { IsAuthenticated } from '../../middlewares/isAuthentecated';

const searchRoute = Router();

/**
 * @description   Search for a user
 * @route         /search/user
 * @access        Private
 */
searchRoute.get('/user', IsAuthenticated, c_searchUser);

/**
 * @description   Search for a product and package
 * @route         /search
 * @access        Private
 */
searchRoute.get('/', IsAuthenticated, c_search);

/**
 * @description   Search for an order
 * @route         /search/order
 * @access        Private
 */
searchRoute.get('/order', IsAuthenticated, c_searchOrder);

export default searchRoute;