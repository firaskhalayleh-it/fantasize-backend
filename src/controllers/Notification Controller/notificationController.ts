import { Request, Response } from 'express';
import { s_addNotification, s_getNotification } from '../../services/Notification Services/notificationServices';

//----------------------- Add Notification-----------------------
export const c_addNotification = async (req:Request , res:Response) =>{

    const result = await s_addNotification(req, res);
    res.status(200).json(result);

} 

//----------------------- Get Notification-----------------------
export const c_getNotification = async (req:Request , res:Response) =>{

    const result = await s_getNotification(req, res);
    res.status(200).json(result);
} 
