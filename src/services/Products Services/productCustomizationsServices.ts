import { Request, Response } from 'express';

//----------------------- Create a new customization product-----------------------
export const s_createCustomizationProduct = async (req:Request , res:Response) =>{
try {
    
} catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}
} 

//----------------------- Get all customization products-----------------------
export const s_getAllCustomizationProducts = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 

//----------------------- Update a customization product-----------------------
export const s_updateCustomizationProduct = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 