import { Request, Response } from 'express';
import { s_addProductFavorites, s_getAllFavoriteProductsUser, s_removeProductFavorites } from '../../services/Products Services/favoriteProductsServices';

//----------------------- Add a product to favorites-----------------------
export const c_addProductFavorites = async (req:Request , res:Response) =>{

    const result = await s_addProductFavorites(req, res);
    res.status(200).json(result);

} 

//----------------------- Get all favorite products for a user-----------------------
export const c_getAllFavoriteProductsUser = async (req:Request , res:Response) =>{

    const result = await s_getAllFavoriteProductsUser(req, res);
    res.status(200).json(result);
} 

//----------------------- Remove a product from favorites-----------------------
export const c_removeProductFavorites = async (req:Request , res:Response) =>{

    const result = await s_removeProductFavorites(req, res);
    res.status(200).json(result);
} 