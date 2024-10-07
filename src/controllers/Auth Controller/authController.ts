import { Request, Response } from 'express';
import { s_loginUser, s_logOutUser, s_signUpUser ,s_resetPassword} from '../../services/Auth Services/authServices';

//----------------------- Register User-----------------------
export const c_registerUser = async (req:Request , res:Response) =>{

    const result = await s_signUpUser(req, res);
    res.status(200).json(result);

} 

//----------------------- login User-----------------------
export const c_loginUser = async (req:Request , res:Response) =>{

    const result = await s_loginUser(req, res);
    res.status(200).json(result);
} 

//----------------------- log out User-----------------------
export const c_logOutUser = async (req:Request , res:Response) =>{

    const result = await s_logOutUser(req, res);
    res.status(200).json(result);
} 

//----------------------- reset password-----------------------
export const c_resetPassword = async (req:Request , res:Response) =>{
        
        const result = await s_resetPassword(req, res);
        res.status(200).json(result);
    }