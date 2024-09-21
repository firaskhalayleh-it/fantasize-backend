import express from "express";
import { getFavoriteProducts, addFavoriteProduct } from "../controllers/favorites_controller";
import { authMiddleware } from "../middlewares/auth_middleware";
import { AuthRequest } from "../middlewares/auth_middleware";  // Import the extended request type

const router = express.Router();



router.post('/favorites/products', authMiddleware, addFavoriteProduct);


export default router;
