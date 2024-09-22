import { Request, Response } from 'express';

//----------------------- Add Notification-----------------------
export const s_addNotification = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }

} 

//----------------------- Get Notification-----------------------
export const s_getNotification = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 
