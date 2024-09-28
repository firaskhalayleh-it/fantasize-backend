import { Request, Response } from 'express';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

} 

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersForUser = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 

//----------------------- Get all orders-----------------------
export const s_getAllOrders = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 

//----------------------- Checkout an order-----------------------
export const s_checkoutOrder = async (req:Request , res:Response) =>{
    try {
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 