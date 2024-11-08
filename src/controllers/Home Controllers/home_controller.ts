
import express from 'express';
import { s_getNewArrivals, s_getRecommendedForYou  } from '../../services/Home Services/home_service';

//----------------------- get new arrivals -----------------------
export const c_getNewArrivals = async (req: express.Request, res: express.Response) => {
    const newArrivals = await s_getNewArrivals(req, res);
    res.status(200).json(newArrivals);
}

//----------------------- get recommended for you -----------------------
export const c_getRecommendedForYou = async (req: express.Request, res: express.Response) => {
    const recommendedProducts = await s_getRecommendedForYou(req, res);
    res.status(200).json(recommendedProducts);
}
