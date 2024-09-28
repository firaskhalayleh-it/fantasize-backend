import { Request, Response } from 'express';

//----------------------- Add a product to favorites-----------------------
export const s_addProductFavorites = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

} 

//----------------------- Get all favorite products for a user-----------------------
export const s_getAllFavoriteProductsUser = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 

//----------------------- Remove a product from favorites-----------------------
export const s_removeProductFavorites = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 