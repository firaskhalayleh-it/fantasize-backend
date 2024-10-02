import { Request, Response } from 'express';
import { s_addPackageFavorites, s_getAllFavoritePackagesUser, s_removePackageFavorites } from '../../services/Packages Services/favoritePackagesServices';

//-----------------------Add a package to favorites-----------------------
export const c_addPackageFavorites = async (req:Request , res:Response) =>{

    const result = await s_addPackageFavorites(req, res);
    res.status(200).json(result);

} 

//----------------------- Get all favorite packages for a user-----------------------
export const c_getAllFavoritePackagesUser = async (req:Request , res:Response) =>{

    const result = await s_getAllFavoritePackagesUser(req, res);
    res.status(200).json(result);
} 

//----------------------- Remove a package from favorites-----------------------
export const c_removePackageFavorites = async (req:Request , res:Response) =>{

    const result = await s_removePackageFavorites(req, res);
    res.status(200).json(result);
} 