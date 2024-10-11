// reviews controller

import { Request, Response } from 'express';
import { s_createReviewProduct, s_createReviewPackage ,s_deleteReview,s_getAllReviewsPackage,s_getAllReviewsProduct, s_updateReview} from '../../services/Reviews Services/reviewsServices';

//----------------------- Create a new review for a product-----------------------
export const c_createReviewProduct = async (req: Request, res: Response) => {
    const result =await s_createReviewProduct(req, res);
    res.status(200).json(result);

}

//----------------------- Create a new review for a package-----------------------
export const c_createReviewPackage = async (req: Request, res: Response) => {
    const result =await s_createReviewPackage(req, res);
    res.status(200).json(result);

}

//----------------------- Get all reviews for a product-----------------------
export const c_getAllReviewsProduct = async (req: Request, res: Response) => {
    const result = await s_getAllReviewsProduct(req, res);
    res.status(200).json(result);

}

//----------------------- Get all reviews for a package-----------------------
export const c_getAllReviewsPackage = async (req: Request, res: Response) => {
    const result = await s_getAllReviewsPackage(req, res);
    res.status(200).json(result);

}

//----------------------- Delete a review-----------------------
export const c_deleteReview = async (req: Request, res: Response) => {
    const result = await s_deleteReview(req, res);
    res.status(200).json(result);

}

export const c_updateReview = async (req: Request, res: Response) => {
    const result = await s_updateReview(req, res);
    res.status(200).json(result);

}

