import { Request, Response } from 'express';
import { s_deleteUser, s_getAllUser, s_getUser, s_searchUser, s_updateUser } from '../../services/Users Services/usersServices';

//----------------------- update user by id-----------------------
export const c_updateUser = async (req:Request , res:Response) =>{

    const result = await s_updateUser(req, res);
    res.status(200).json(result);

} 

//----------------------- delete user by id-----------------------
export const c_deleteUser = async (req:Request , res:Response) =>{

    const result = await s_deleteUser(req, res);
    res.status(200).json(result);
} 


//----------------------- get user by id (and using this to create profile)-----------------------
export const c_getUser = async (req:Request , res:Response) =>{

    const result = await s_getUser(req, res);
    res.status(200).json(result);
} 


//----------------------- search user by username -----------------------
export const c_searchUser = async (req:Request , res:Response) =>{

    const result = await s_searchUser(req, res);
    res.status(200).json(result);
} 

//----------------------- get all user  -----------------------
export const c_getAllUser = async (req:Request , res:Response) =>{

    const result = await s_getAllUser(req, res);
    res.status(200).json(result);
} 