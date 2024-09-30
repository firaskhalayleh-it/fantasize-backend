import express from "express"
import { authMiddleware } from "../../middlewares/auth_middleware";
import { IsAuthenticated, isAuthorized } from "../../middlewares/isAuthentecated";
import { c_addProductFavorites, c_getAllFavoriteProductsUser, c_removeProductFavorites } from "../../controllers/Products Controller/favoriteProductsController";
const FavoriteProductRoute = express.Router({ mergeParams: true });

/**
 *  @description   Add a product to favorites
 *  @route         /favorites
 *  @method        POST
 *  @access        Public
 */
FavoriteProductRoute.post('/favorites' , isAuthorized ,c_addProductFavorites);

/**
 *  @description   Get all favorite products for a user
 *  @route         /favorites/:userId
 *  @method        GET
 *  @access        Public
 */
export const userFaves = FavoriteProductRoute.get('/favorites' , IsAuthenticated,c_getAllFavoriteProductsUser);

/**
 *  @description   Remove a product from favorites
 *  @route         /favorites
 *  @method        DELETE
 *  @access        Public
 */
FavoriteProductRoute.delete('/favorites/:productId' , IsAuthenticated ,c_removeProductFavorites);

export default FavoriteProductRoute;
