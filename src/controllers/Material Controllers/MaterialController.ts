// material controller

import { Request, Response } from 'express';
import { s_createMaterial,s_deleteMaterial,s_getMaterialById,s_getMaterials,s_updateMaterial,s_assignMaterialsToPackage,s_assignMaterialsToProduct,s_getMaterialsForProduct,s_getProductsForMaterial,s_unassignMaterialsFromPackage,s_unassignMaterialsFromProduct,s_updateMaterialsForPackage,
    s_updateMaterialsForProduct,s_getMaterialsForPackage
 } from '../../services/Material Services/MaterialService';

export const c_createMaterial = async (req: Request, res: Response) => {
    const result = await s_createMaterial(req, res);
    res.status(200).json(result);
}

export const c_getMaterials = async (req: Request, res: Response) => {
    const result = await s_getMaterials(req, res);
    res.status(200).json(result);
}

export const c_getMaterialById = async (req: Request, res: Response) => {
    const result = await s_getMaterialById(req, res);
    res.status(200).json(result);
}

export const c_updateMaterial = async (req: Request, res: Response) => {
    const result = await s_updateMaterial(req, res);
    res.status(200).json(result);
}

export const c_deleteMaterial = async (req: Request, res: Response) => {
    const result = await s_deleteMaterial(req, res);
    res.status(200).json(result);
}

export const c_assignMaterialsToPackage = async (req: Request, res: Response) => {
    const result = await s_assignMaterialsToPackage(req, res);
    res.status(200).json(result);
}

export const c_assignMaterialsToProduct = async (req: Request, res: Response) => {
    const result = await s_assignMaterialsToProduct(req, res);
    res.status(200).json(result);
}

export const c_getMaterialsForProduct = async (req: Request, res: Response) => {
    const result = await s_getMaterialsForProduct(req, res);
    res.status(200).json(result);
}

export const c_getProductsForMaterial = async (req: Request, res: Response) => {
    const result = await s_getProductsForMaterial(req, res);
    res.status(200).json(result);
}


export const c_unassignMaterialsFromPackage = async (req: Request, res: Response) => {
    const result = await s_unassignMaterialsFromPackage(req, res);
    res.status(200).json(result);
}

export const c_unassignMaterialsFromProduct = async (req: Request, res: Response) => {
    const result = await s_unassignMaterialsFromProduct(req, res);
    res.status(200).json(result);
}

export const c_updateMaterialsForPackage = async (req: Request, res: Response) => {
    const result = await s_updateMaterialsForPackage(req, res);
    res.status(200).json(result);
}

export const c_updateMaterialsForProduct = async (req: Request, res: Response) => {
    const result = await s_updateMaterialsForProduct(req, res);
    res.status(200).json(result);
}

export const c_getMaterialsForPackage = async (req: Request, res: Response) => {
    const result = await s_getMaterialsForPackage(req, res);
    res.status(200).json
    (result);
}
