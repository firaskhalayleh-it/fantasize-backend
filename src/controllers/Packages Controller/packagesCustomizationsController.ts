// package customizations controller
import { Request, Response } from 'express';
import { s_createCustomizationPackage, s_getAllCustomizationPackages, s_updateCustomizationPackage,s_assignCustomizationToPackage, s_deleteCustomizationPackage } from '../../services/Packages Services/packagesCustomizationsServices';


//----------------------- Create a new customization for a package -----------------------
export const c_createCustomizationPackage = async (req: Request, res: Response) => {
    await s_createCustomizationPackage(req, res);
}

//----------------------- Get all customizations for a package -----------------------
export const c_getAllCustomizationPackages = async (req: Request, res: Response) => {
    await s_getAllCustomizationPackages(req, res);
}

//----------------------- Update a package customization -----------------------
export const c_updateCustomizationPackage = async (req: Request, res: Response) => {
    await s_updateCustomizationPackage(req, res);
}

//----------------------- Assign a customization to a package -----------------------
export const c_assignCustomizationToPackage = async (req: Request, res: Response) => {
    await s_assignCustomizationToPackage(req, res);
}

//----------------------- Delete a package customization -----------------------
export const c_deleteCustomizationPackage = async (req: Request, res: Response) => {
    await s_deleteCustomizationPackage(req, res);
}
