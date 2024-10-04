

import { Request, Response } from 'express';
import { s_createProduct, s_getAllProducts, s_getProduct, s_getProductByCategoryAndSubCategory, s_getProductByCategoryID, s_updateProduct } from '../../services/Products Services/productServices';



// ---------------------> Get all products <---------------------
export const c_getAllProducts = async (req: Request, res: Response) => {
    const result = await s_getAllProducts(req, res);
    return res.status(200).send(result);

}

// ---------------------> Get product by id <---------------------
export const c_getProduct = async (req: Request, res: Response) => {
    const result = await s_getProduct(req, res);
    return res.status(200).send(result);
}

// ---------------------> Get product by category and sub category<---------------------
export const c_getProductByCategoryAndSubCategory = async (req: Request, res: Response) => {
    const result = await s_getProductByCategoryAndSubCategory(req, res);
    return res.status(200).send(result);
}

// ---------------------> Get product by category <---------------------
export const c_getProductByCategoryID = async (req: Request, res: Response) => {
    const result = await s_getProductByCategoryID(req, res);
    return res.status(200).send(result);
}

// ---------------------> Create a new product <---------------------
export const c_createProduct = async (req: Request, res: Response) => {
    const result = await s_createProduct(req, res);
    return res.status(200).send(result);
}

// ---------------------> Update a product <---------------------
export const c_updateProduct = async (req: Request, res: Response) => {
    const result = await s_updateProduct(req, res);
    return res.status(200).send(result);
}