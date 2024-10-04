import { Request, Response } from 'express';
import { s_assignCustomizationToProduct, s_createCustomizationProduct, s_deleteCustomizationProduct, s_getAllCustomizationProducts, s_updateCustomizationProduct } from '../../services/Products Services/productCustomizationsServices';

//----------------------- Create a new customization product-----------------------
export const c_createCustomizationProduct = async (req:Request , res:Response) =>{

    const result = await s_createCustomizationProduct(req, res);
    res.status(200).json(result);

} 

//----------------------- Get all customization products-----------------------
export const c_getAllCustomizationProducts = async (req:Request , res:Response) =>{

    const result = await s_getAllCustomizationProducts(req, res);
    res.status(200).json(result);
} 

//----------------------- Update a customization product-----------------------
export const c_updateCustomizationProduct = async (req:Request , res:Response) =>{

    const result = await s_updateCustomizationProduct(req, res);
    res.status(200).json(result);
} 

//--------------------------- delete customization product-----------------------
export const c_deleteCustomizationProduct = async (req:Request , res:Response) =>{
    const result = await s_deleteCustomizationProduct(req, res);
    res.status(200).json(result);
}

//----------------------- Assign a customization product to a product-----------------------
export const c_assignCustomizationProduct = async (req:Request , res:Response) =>{
    const result = await s_assignCustomizationToProduct(req, res);
    res.status(200).json(result);
}