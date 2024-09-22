import { Request, Response } from 'express';

//----------------------- Add new adress by userId----------------------
export const s_addNewAdress = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 

//----------------------- update user address by userId-----------------------
export const s_updateUserAddress = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- delete user address by userId-----------------------
export const s_deleteUserAddress = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- get user address by userId -----------------------
export const s_getUserAddress = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }

} 

//----------------------- get all user  -----------------------
export const s_getAllUser = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 