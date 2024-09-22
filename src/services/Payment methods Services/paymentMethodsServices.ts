import { Request, Response } from 'express';

//----------------------- create new user payment Method by userId-----------------------
export const s_createPaymentMethod = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 

//----------------------- update user payment Method by userId-----------------------
export const s_updatePaymentMethod = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- get user payment Method by userId-----------------------
export const s_getPaymentMethod = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- delete user payment Method by userId-----------------------
export const s_deletePaymentMethod = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 