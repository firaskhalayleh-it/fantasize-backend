import { Request, Response } from 'express';
import { s_createPaymentMethod, s_deletePaymentMethod, s_getPaymentMethod, s_updatePaymentMethod } from '../../services/Payment methods Services/paymentMethodsServices';

//----------------------- create new user payment Method by userId-----------------------
export const c_createPaymentMethod = async (req:Request , res:Response) =>{

    const result = await s_createPaymentMethod(req, res);
    res.status(200).json(result);

} 

//----------------------- update user payment Method by userId-----------------------
export const c_updatePaymentMethod = async (req:Request , res:Response) =>{

    const result = await s_updatePaymentMethod(req, res);
    res.status(200).json(result);
} 


//----------------------- get user payment Method by userId-----------------------
export const c_getPaymentMethod = async (req:Request , res:Response) =>{

    const result = await s_getPaymentMethod(req, res);
    res.status(200).json(result);
} 


//----------------------- delete user payment Method by userId-----------------------
export const c_deletePaymentMethod = async (req:Request , res:Response) =>{

    const result = await s_deletePaymentMethod(req, res);
    res.status(200).json(result);
} 