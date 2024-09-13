import express from "express";
import { getFavoriteProducts, addFavoriteProduct } from "../controllers/favorites_controller";
import { authMiddleware } from "../middlewares/auth_middleware";
import { AuthRequest } from "../middlewares/auth_middleware";  // Import the extended request type

const router = express.Router();

router.get('/favorites', authMiddleware, async (req: AuthRequest, res) => {
    const user = req.user;  
    if (user) {
        res.json({ message: 'User profile', user });
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
});


router.post('/favorites/products', authMiddleware, addFavoriteProduct);

router.delete('/favorites/products/:id', authMiddleware, async (req: AuthRequest, res) => {
    const user = req.user;
    if (user) {
        res.json({ message: 'User profile', user });
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
});

export default router;
