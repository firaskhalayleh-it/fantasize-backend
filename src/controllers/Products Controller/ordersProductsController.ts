// src/controllers/Products Controller/ordersProductsController.ts

import { Request, Response } from 'express';
import { createNewOrderProduct, deleteOrderProduct, updateOrderProduct } from '../../services/Products Services/ordersProductsServices';

//----------------------- Create a new order for a user-----------------------
export const c_createNewOrderUser = async (req: Request, res: Response) => {
    await createNewOrderProduct(req, res);
}

//----------------------- Update a specific product order-----------------------
export const c_updateOrderProduct = async (req: Request, res: Response) => {
    await updateOrderProduct(req, res);
}

//----------------------- delete a specific product order-----------------------
export const c_deleteOrderProduct = async (req: Request, res: Response) => {
    await deleteOrderProduct(req, res);
}