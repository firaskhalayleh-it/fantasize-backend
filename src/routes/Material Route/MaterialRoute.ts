// material route

import express from 'express';
import { c_createMaterial, c_deleteMaterial, c_getMaterialById, c_getMaterials, c_updateMaterial } from '../../controllers/Material Controllers/MaterialController';
import { IsAuthenticated } from '../../middlewares/isAuthentecated';

const materialRoutes = express.Router();

/**
 * @description   Create a new material
 * @route         POST /material
 * @access        Private
 */
materialRoutes.post('/material', IsAuthenticated, c_createMaterial);

/**
 * @description   Get all materials
 * @route         GET /material
 * @access        Private
 */
materialRoutes.get('/material', IsAuthenticated, c_getMaterials);

/**
 * @description   Get a material by ID
 * @route         GET /material/:id
 * @access        Private
 */
materialRoutes.get('/material/:id', IsAuthenticated, c_getMaterialById);

/**
 * @description   Update a material
 * @route         PUT /material/:id
 * @access        Private
 */
materialRoutes.put('/material/:id', IsAuthenticated, c_updateMaterial);

/**
 * @description   Delete a material
 * @route         DELETE /material/:id
 * @access        Private
 */

materialRoutes.delete('/material/:id', IsAuthenticated, c_deleteMaterial);

export default materialRoutes;
