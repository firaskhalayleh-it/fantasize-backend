import { Request, Response } from 'express';
import { s_checkoutOrderUser, s_getAllOrdersAdmin, s_getAllOrdersUser,
     s_getOrder, s_getCartUser ,s_updateOrderStatus
    ,s_approveOrder,s_rejectOrder} from '../../services/Order Services/orderServices';

//----------------------- Create a new order for a user-----------------------
export const c_checkoutOrderUser = async (req: Request, res: Response) => {
   const result= await s_checkoutOrderUser(req, res);
   res.status(200).json(result);

}



//----------------------- Get all orders for a user-----------------------
export const c_getAllOrdersUser = async (req: Request, res: Response) => {
    const result= await s_getAllOrdersUser(req, res);
    res.status(200).json(result);

}

//----------------------- Get all orders for a user-----------------------
export const c_getAllOrdersAdmin = async (req: Request, res: Response) => {
    const result= await s_getAllOrdersAdmin(req, res);
    res.status(200).json(result);

}

//----------------------- Get order by id-----------------------
export const c_getOrder = async (req: Request, res: Response) => {
    const result= await s_getOrder(req, res);
    res.status(200).json(result);

}

//----------------------- Get cart by user-----------------------
export const c_getCartForUser = async (req: Request, res: Response) => {
    const result= await s_getCartUser(req, res);
    res.status(200).json(result);

}


//----------------------- Update order status-----------------------
export const c_updateOrderStatus = async (req: Request, res: Response) => {
    const result= await s_updateOrderStatus(req, res);
    res.status(200).json(result);

}

//----------------------- Approve order-----------------------
export const c_approveOrder = async (req: Request, res: Response) => {
    const result= await s_approveOrder(req, res);
    res.status(200).json(result);

}

//----------------------- Reject order-----------------------
export const c_rejectOrder = async (req: Request, res: Response) => {
    const result= await s_rejectOrder(req, res);
    res.status(200).json(result);

}
