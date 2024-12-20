// search controller 
import { s_search,s_searchUser ,s_searchOrder } from "../../services/SearchService/searchService";
import { Request, Response } from 'express';

// ---------------------> Search for a user <---------------------
export const c_searchUser = async (req: Request, res: Response) => {
    const result = await s_searchUser(req, res);
    return res.status(200).send(result);
}

// ---------------------> Search for a product and package <---------------------
export const c_search = async (req: Request, res: Response) => {
    const result = await s_search(req, res);
    return res.status(200).send(result);
}

// ---------------------> Search for an order <---------------------
export const c_searchOrder = async (req: Request, res: Response) => {
    const result = await s_searchOrder(req, res);
    return res.status(200).send(result);
}
