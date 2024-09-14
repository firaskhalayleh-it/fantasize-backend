import { Router } from "express";
import { getCategoriesWithSubCategory,addCategory,addSubCategory,getSubCategories,getCategories } from "../controllers/category_controller";
import { authMiddleware } from "../middlewares/auth_middleware";
import { adminMiddleware } from "../middlewares/admin_middleware";

const router = Router();

router.get('/categories', getCategoriesWithSubCategory);
router.get('/subcategories', getSubCategories);
router.get('/categories', getCategories);

//administrator routes

router.post('/categories/add', authMiddleware, adminMiddleware, addCategory);
router.post('/subcategories/add', authMiddleware, adminMiddleware, addSubCategory);

export default router;