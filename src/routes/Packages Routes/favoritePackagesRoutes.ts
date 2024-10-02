import  express  from 'express';
import { authMiddleware } from '../../middlewares/auth_middleware';
import { IsAuthenticated } from '../../middlewares/isAuthentecated';
import { c_addPackageFavorites, c_getAllFavoritePackagesUser, c_removePackageFavorites } from '../../controllers/Packages Controller/favoritePackagesController';

const favoritePackagesRoute = express.Router();


/**
 *  @description   Add a package to favorites
 *  @route         /users/:userId/favoritePackages
 *  @method        POST
 *  @access        private (user)
 */
favoritePackagesRoute.post('/favoritePackages/:packageId',IsAuthenticated,c_addPackageFavorites);

/**
 *  @description   Get all favorite packages for a user
 *  @route         /users/:userId/favoritePackages
 *  @method        GET
 *  @access        private (user)
 */
favoritePackagesRoute.get('/favoritePackages',IsAuthenticated ,c_getAllFavoritePackagesUser);

/**
 *  @description   Remove a package from favorites
 *  @route         /users/:userId/favoritePackages
 *  @method        DELETE
 *  @access        private (user)
 */
favoritePackagesRoute.delete('/favoritePackages/:packageId',IsAuthenticated,c_removePackageFavorites);

export default favoritePackagesRoute;
