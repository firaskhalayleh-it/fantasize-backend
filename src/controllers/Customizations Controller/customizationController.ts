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
    s_createCustomization(req, res);
};

export const c_updateCustomization = async (req: Request, res: Response) => {
    s_updateCustomization(req, res);
};

export const c_getAllCustomizations = async (req: Request, res: Response) => {
    s_getAllCustomizations(req, res);
};

export const c_assignCustomizationToProduct = async (req: Request, res: Response) => {
    s_assignCustomizationToProduct(req, res);
};

export const c_assignCustomizationToPackage = async (req: Request, res: Response) => {
    s_assignCustomizationToPackage(req, res);
};

export const c_removeCustomizationFromProduct = async (req: Request, res: Response) => {
    s_removeCustomizationFromProduct(req, res);
};

export const c_removeCustomizationFromPackage = async (req: Request, res: Response) => {
    s_removeCustomizationFromPackage(req, res);
};

