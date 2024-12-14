// contact us controller for contact us form

import { Request, Response } from 'express';
import { s_addContactUs, s_getContactUs, s_getContactUsById } from '../../services/generalService/contactUsService';

export const c_getContactUs = async (req: Request, res: Response) => {
    const result = await s_getContactUs(req, res);
    res.status(200).json(result);
}

export const c_getContactUsById = async (req: Request, res: Response) => {
    const result = await s_getContactUsById(req, res);
    res.status(200).json(result);
}

export const c_addContactUs = async (req: Request, res: Response) => {
    const result = await s_addContactUs(req, res);
    res.status(200).json(result);
}
