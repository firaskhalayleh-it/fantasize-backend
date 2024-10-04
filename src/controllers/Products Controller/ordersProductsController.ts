// src/controllers/Products Controller/ordersProductsController.ts

import { Request, Response } from 'express';
import { s_createNewOrderUser, s_deleteOrderProduct, s_updateOrderProduct } from '../../services/Products Services/ordersProductsServices';

//----------------------- Create a new order for a user-----------------------
export const c_createNewOrderUser = async (req: Request, res: Response) => {
    await s_createNewOrderUser(req, res);
}

//----------------------- Update a specific product order-----------------------
export const c_updateOrderProduct = async (req: Request, res: Response) => {
    await s_updateOrderProduct(req, res);
}

//----------------------- delete a specific product order-----------------------
export const c_deleteOrderProduct = async (req: Request, res: Response) => {
    await s_deleteOrderProduct(req, res);
}