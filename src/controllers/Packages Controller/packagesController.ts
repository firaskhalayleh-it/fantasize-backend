import { Request, Response } from 'express';
import { s_createPackage, s_getAllPackages, s_getAllPackagesUnderSpecificSubcategory, s_getPackageByID, s_updatePackage } from '../../services/Packages Services/packagesServices';

//----------------------- Create a new package-----------------------
export const c_createPackage = async (req:Request , res:Response) =>{

    const result = await s_createPackage(req, res);
    res.status(200).json(result);

} 

//----------------------- Get all packages-----------------------
export const c_getAllPackages = async (req:Request , res:Response) =>{

    const result = await s_getAllPackages(req, res);
    res.status(200).json(result);
} 

//-----------------------Get all packages under a specific subcategory-----------------------
export const c_getAllPackagesUnderSpecificSubcategory = async (req:Request , res:Response) =>{

    const result = await s_getAllPackagesUnderSpecificSubcategory(req, res);
    res.status(200).json(result);
} 

//----------------------- Get a package by ID-----------------------
export const c_getPackageByID = async (req:Request , res:Response) =>{

    const result = await s_getPackageByID(req, res);
    res.status(200).json(result);
} 

//----------------------- Update a package-----------------------
export const c_updatePackage = async (req:Request , res:Response) =>{

    const result = await s_updatePackage(req, res);
    res.status(200).json(result);
} 