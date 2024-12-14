// general controller for general data of website as about us and contact us 

import { Request, Response } from 'express';
import { s_addGeneral, s_getGeneral, s_updateGeneral } from '../../services/generalService/generalService';

export const c_getGeneral = async (req: Request, res: Response) => {
    const result = await s_getGeneral(req, res);
    res.status(200).json(result);
}

export const c_updateGeneral = async (req: Request, res: Response) => {
    const result = await s_updateGeneral(req, res);
    res.status(200).json(result);
}

export const c_addGeneral = async (req: Request, res: Response) => {
    const result = await s_addGeneral(req, res);
    res.status(200).json(result);
}
