import { Request, Response } from 'express';
import { s_addNewBrand, s_deleteBrand, s_getAllBrands, s_updateBrand } from '../../services/Brands Services/brandsServices';

//-----------------------Add a new brand -----------------------
export const c_addNewBrand = async (req:Request , res:Response) =>{

    const result = await s_addNewBrand(req, res);
    res.status(200).json(result);

} 

//----------------------- Get all brands-----------------------
export const c_getAllBrands = async (req:Request , res:Response) =>{

    const result = await s_getAllBrands(req, res);
    res.status(200).json(result);
} 


//----------------------- Update a brand-----------------------
export const c_updateBrand = async (req:Request , res:Response) =>{

    const result = await s_updateBrand(req, res);
    res.status(200).json(result);
} 


//----------------------- Delete a brand-----------------------
export const c_deleteBrand = async (req:Request , res:Response) =>{

    const result = await s_deleteBrand(req, res);
    res.status(200).json(result);
} 
