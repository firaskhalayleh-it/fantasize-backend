import { Request, Response } from 'express';
import { s_loginUserUsingGoogle } from '../../services/Auth Services/authUsingFacebookGoogleServices';

export const c_loginUserUsingGoogle = async (req: Request, res: Response) => {
    try {
        const result = await s_loginUserUsingGoogle(req , res);
        res.status(200).json(result);
    } catch (err :any) {
        res.status(500).json({ message: err.message });
    }
};
