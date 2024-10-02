import { Request, Response } from 'express';
import { s_checkoutOrder, s_createNewOrderUser, s_getAllOrders, s_getAllOrdersForUser } from '../../services/Packages Services/ordersPackagesServices';

//----------------------- Create a new order for a user-----------------------
export const c_createNewOrderUser = async (req:Request , res:Response) =>{

    const result = await s_createNewOrderUser(req, res);
    res.status(200).json(result);

} 

//----------------------- Get all orders for a user-----------------------
export const c_getAllOrdersForUser = async (req:Request , res:Response) =>{

    const result = await s_getAllOrdersForUser(req, res);
    res.status(200).json(result);
} 

//----------------------- Get all orders-----------------------
export const c_getAllOrders = async (req:Request , res:Response) =>{

    const result = await s_getAllOrders(req, res);
    res.status(200).json(result);
} 

//----------------------- Checkout an order-----------------------
export const c_checkoutOrder = async (req:Request , res:Response) =>{

    const result = await s_checkoutOrder(req, res);
    res.status(200).json(result);
} 