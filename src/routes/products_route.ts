import { Router } from "express";
import { authMiddleware } from "../middlewares/auth_middleware";
import { adminMiddleware } from "../middlewares/admin_middleware";
import { addNewProduct, getProductInDetail, getProductsList, updateProduct } from "../controllers/product_controller";

const router = Router();
// This route is for public access
router.get('/products', getProductsList);
router.get('/products/:id', getProductInDetail);


// This route is for admin access
router.post('/products', authMiddleware, adminMiddleware,addNewProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, updateProduct);


export default router;