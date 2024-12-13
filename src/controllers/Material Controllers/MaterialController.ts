// material controller

import { Request, Response } from 'express';
import { s_createMaterial,s_deleteMaterial,s_getMaterialById,s_getMaterials,s_updateMaterial } from '../../services/Material Services/MaterialService';

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

