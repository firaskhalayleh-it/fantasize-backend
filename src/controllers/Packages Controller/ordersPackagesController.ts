import { Request, Response } from 'express';
import {  s_createNewOrderUser, s_deleteOrderPackage, s_updateOrderPackage } from '../../services/Packages Services/ordersPackagesServices';

//----------------------- Create a new order for a user-----------------------
export const c_createNewOrderUser = async (req:Request , res:Response) =>{

    const result = await s_createNewOrderUser(req, res);
    res.status(200).json(result);

} 

//----------------------- Update a specific pakcage order-----------------------
export const c_updateOrderPackage = async (req:Request , res:Response) =>{

    const result = await s_updateOrderPackage(req, res);
    res.status(200).json(result);

}

//----------------------- delete a specific package order-----------------------
export const c_deleteorderPackage = async (req:Request , res:Response) =>{
    const result = await s_deleteOrderPackage(req, res);
    res.status(200).json(result);
}