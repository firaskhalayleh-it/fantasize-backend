import { Router } from "express";
import {
    getProductsByCategory,
    getProducsBySubCategory,
    getProductsByPriceRange,
    getProductsByMaterial,
    getProductsBySize,
    getProductsByStatus,
    getProductsByBrand
} from "../controllers/filters_controller";




const router = Router();

router.get('/products/category/:category', getProductsByCategory);
router.get('/products/subcategory/:subCategory', getProducsBySubCategory);
router.get('/products/price-range/:min/:max', getProductsByPriceRange);
router.get('/products/material/:material', getProductsByMaterial);
router.get('/products/size/:size', getProductsBySize);
router.get('/products/status/:status', getProductsByStatus);
router.get('/products/brand/:brand', getProductsByBrand);


export default router;



