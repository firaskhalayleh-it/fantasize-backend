// order controller

import { Request, Response } from 'express';
import { s_checkoutOrderUser,s_getAllOrders,s_deleteOrder,s_getAllOrdersAdmin,s_getAllOrdersUser,s_getOrder, s_getCartUser } from '../../services/Order Services/orderServices';

//----------------------- Create a new order for a user-----------------------
export const c_checkoutOrderUser = async (req: Request, res: Response) => {
    await s_checkoutOrderUser(req, res);
}

//----------------------- Get all orders for a user-----------------------
export const c_getAllOrders = async (req: Request, res: Response) => {
    await s_getAllOrders(req, res);
}

//----------------------- Get all orders for a user-----------------------
export const c_getAllOrdersUser = async (req: Request, res: Response) => {
    await s_getAllOrdersUser(req, res);
}

//----------------------- Get all orders for a user-----------------------
export const c_getAllOrdersAdmin = async (req: Request, res: Response) => {
    await s_getAllOrdersAdmin(req, res);
}

//----------------------- Get order by id-----------------------
export const c_getOrder = async (req: Request, res: Response) => {
    await s_getOrder(req, res);
}

//----------------------- Get cart by user-----------------------
export const c_getCartForUser = async (req: Request, res: Response) => {
    await s_getCartUser(req, res);
}

