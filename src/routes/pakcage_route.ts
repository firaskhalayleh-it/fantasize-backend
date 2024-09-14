import { Router } from "express";

import {
    getPackageList,
    getPackageInDetail,
    createPackage,
    updatePackage,
} from "../controllers/package_controller";
import { authMiddleware } from "../middlewares/auth_middleware";
import { adminMiddleware } from "../middlewares/admin_middleware";

const router = Router();

router.get('/packages', getPackageList);
router.get('/packages/:id', getPackageInDetail);

//administrator routes

router.post('/packages/add', authMiddleware, adminMiddleware, createPackage);
router.put('/packages/update/:id', authMiddleware, adminMiddleware, updatePackage);


export default router;  