// src/controllers/Products Controller/ordersProductsController.ts

import { Request, Response } from 'express';
import { s_checkoutOrder, s_createNewOrderUser, s_getAllOrders, s_getAllOrdersForUser } from '../../services/Products Services/ordersProductsServices';

//----------------------- Create a new order for a user-----------------------
export const c_createNewOrderUser = async (req: Request, res: Response) => {
    await s_createNewOrderUser(req, res);
}

//----------------------- Get all orders for a user-----------------------
export const c_getAllOrdersForUser = async (req: Request, res: Response) => {
    await s_getAllOrdersForUser(req, res);
}

//----------------------- Get all orders-----------------------
export const c_getAllOrders = async (req: Request, res: Response) => {
    await s_getAllOrders(req, res);
}

//----------------------- Checkout an order-----------------------
export const c_checkoutOrder = async (req: Request, res: Response) => {
    await s_checkoutOrder(req, res);
}
