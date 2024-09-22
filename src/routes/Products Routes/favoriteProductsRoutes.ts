import express from "express"
import { authMiddleware } from "../../middlewares/auth_middleware";
const FavoriteProductRoute = express.Router();

/**
 *  @description   Add a product to favorites
 *  @route         /favorites
 *  @method        POST
 *  @access        Public
 */
FavoriteProductRoute.post('/favorites' , authMiddleware);

/**
 *  @description   Get all favorite products for a user
 *  @route         /favorites/:userId
 *  @method        GET
 *  @access        Public
 */
FavoriteProductRoute.get('/favorites/:userId' , authMiddleware);

/**
 *  @description   Remove a product from favorites
 *  @route         /favorites
 *  @method        DELETE
 *  @access        Public
 */
FavoriteProductRoute.delete('/favorites/:userId' , authMiddleware);

export default FavoriteProductRoute;
