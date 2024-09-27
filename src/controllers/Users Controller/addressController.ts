import { Request, Response } from 'express';
import {  s_addNewOrUpdateAddress, s_deleteUserAddress, s_getUserAddress } from '../../services/Users Services/addressServices';

//----------------------- Add new adress by userId----------------------
export const c_addNewAdress = async (req:Request , res:Response) =>{

    const result = await s_addNewOrUpdateAddress(req, res);
    res.status(200).json(result);

} 

//----------------------- update user address by userId-----------------------
export const c_updateUserAddress = async (req:Request , res:Response) =>{

    const result = await s_addNewOrUpdateAddress(req, res);
    res.status(200).json(result);
} 


//----------------------- delete user address by userId-----------------------
export const c_deleteUserAddress = async (req:Request , res:Response) =>{

    const result = await s_deleteUserAddress(req, res);
    res.status(200).json(result);
} 


//----------------------- get user address by userId -----------------------
export const c_getUserAddress = async (req:Request , res:Response) =>{

    const result = await s_getUserAddress(req, res);
    res.status(200).json(result);
} 



