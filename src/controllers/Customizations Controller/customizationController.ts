import { Request, Response } from "express";
import {
    s_assignCustomizationToPackage
    , s_assignCustomizationToProduct
    , s_createCustomization
    , s_getAllCustomizations,
    s_removeCustomizationFromPackage, s_removeCustomizationFromProduct
    , s_updateCustomization
} from "../../services/Customization Services/customizationService";


//controller for customizations
export const c_createCustomization = async (req: Request, res: Response) => {
    await s_createCustomization(req, res);
};


export const c_updateCustomization = async (req: Request, res: Response) => {
    const result= await s_updateCustomization(req, res);
    res.status(200).json(result);

};

export const c_getAllCustomizations = async (req: Request, res: Response) => {
    const result= await s_getAllCustomizations(req, res);
    res.status(200).json(result);

};

export const c_assignCustomizationToProduct = async (req: Request, res: Response) => {
    const result= await s_assignCustomizationToProduct(req, res);
    res.status(200).json(result);

};

export const c_assignCustomizationToPackage = async (req: Request, res: Response) => {
    const result= await s_assignCustomizationToPackage(req, res);
    res.status(200).json(result);

};

export const c_removeCustomizationFromProduct = async (req: Request, res: Response) => {
    const result= await s_removeCustomizationFromProduct(req, res);
    res.status(200).json(result);

};

export const c_removeCustomizationFromPackage = async (req: Request, res: Response) => {
    const result= await s_removeCustomizationFromPackage(req, res);
    res.status(200).json(result);

};

