import  express  from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';

const favoritePackagesRoute = express.Router();


/**
 *  @description   Add a package to favorites
 *  @route         /users/:userId/favoritePackages
 *  @method        POST
 *  @access        private 
 */
favoritePackagesRoute.post('/users/:userId/favoritePackages',authMiddleware);

/**
 *  @description   Get all favorite packages for a user
 *  @route         /users/:userId/favoritePackages
 *  @method        GET
 *  @access        private
 */
favoritePackagesRoute.get('/users/:userId/favoritePackages',authMiddleware);

/**
 *  @description   Remove a package from favorites
 *  @route         /users/:userId/favoritePackages
 *  @method        DELETE
 *  @access        private
 */
favoritePackagesRoute.delete('/users/:userId/favoritePackages',authMiddleware);

export default favoritePackagesRoute;
