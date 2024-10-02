// reviews controller

import { Request, Response } from 'express';
import { s_createReviewProduct, s_createReviewPackage ,s_deleteReview,s_getAllReviewsPackage,s_getAllReviewsProduct} from '../../services/Reviews Services/reviewsServices';

//----------------------- Create a new review for a product-----------------------
export const c_createReviewProduct = async (req: Request, res: Response) => {
    await s_createReviewProduct(req, res);
}

//----------------------- Create a new review for a package-----------------------
export const c_createReviewPackage = async (req: Request, res: Response) => {
    await s_createReviewPackage(req, res);
}

//----------------------- Get all reviews for a product-----------------------
export const c_getAllReviewsProduct = async (req: Request, res: Response) => {
    await s_getAllReviewsProduct(req, res);
}

//----------------------- Get all reviews for a package-----------------------
export const c_getAllReviewsPackage = async (req: Request, res: Response) => {
    await s_getAllReviewsPackage(req, res);
}

//----------------------- Delete a review-----------------------
export const c_deleteReview = async (req: Request, res: Response) => {
    await s_deleteReview(req, res);
}

