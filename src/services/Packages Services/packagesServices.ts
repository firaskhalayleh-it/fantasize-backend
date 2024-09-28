import { Request, Response } from 'express';

//----------------------- Create a new package-----------------------
export const s_createPackage = async (req:Request , res:Response) =>{
try{
    
}catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

} 

//----------------------- Get all packages-----------------------
export const s_getAllPackages = async (req:Request , res:Response) =>{
    try{

    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//-----------------------Get all packages under a specific subcategory-----------------------
export const s_getAllPackagesUnderSpecificSubcategory = async (req:Request , res:Response) =>{
    try{

    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//----------------------- Get a package by ID-----------------------
export const s_getPackageByID = async (req:Request , res:Response) =>{
    try{

    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//----------------------- Update a package-----------------------
export const s_updatePackage = async (req:Request , res:Response) =>{
    try{

    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 