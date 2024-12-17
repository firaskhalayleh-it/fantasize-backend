//controller for offers

import { Request, Response } from 'express';
import { s_createOfferProduct,s_createOfferPackage, s_getAllOffers,s_getAllOffersForProduct,s_getAllOffersForPackage, s_getOfferByID, s_updateOffer, s_homeOffers, s_createNewOffer } from '../../services/Offers Services/offersServices';

//----------------------- Create a new offer for Product -----------------------
export const c_createNewOffer = async (req:Request , res:Response) =>{
   const result = await s_createNewOffer(req, res);
   res.status(200).json(result);
}
//----------------------- Create a new offer for Product -----------------------
export const c_createOfferProduct = async (req:Request , res:Response) =>{
   const result = await s_createOfferProduct(req, res);
   res.status(200).json(result);
}

//----------------------- Create a new offer for Package -----------------------
export const c_createOfferPackage = async (req:Request , res:Response) =>{
    const result =await s_createOfferPackage(req, res);
    res.status(200).json(result);
}

//----------------------- Get all offers for all-----------------------
export const c_getAllOffers = async (req:Request , res:Response) =>{
    const result = await s_getAllOffers(req, res);
    res.status(200).json(result);

}


// ----------------------- Get all offers for a product-----------------------
export const c_getAllOffersForProduct = async (req:Request , res:Response) =>{
    const result = await s_getAllOffersForProduct(req, res);
    res.status(200).json(result);

}

//----------------------- Get all offers for a package-----------------------
export const c_getAllOffersForPackage = async (req:Request , res:Response) =>{
    const result = await s_getAllOffersForPackage(req, res);
    res.status(200).json(result);

}


//----------------------- Get offer by ID-----------------------
export const c_getOfferByID = async (req:Request , res:Response) =>{
    const result = await s_getOfferByID(req, res);
    res.status(200).json(result);

}

//----------------------- Update an offer-----------------------
export const c_updateOffer = async (req:Request , res:Response) =>{
    const result = await s_updateOffer(req, res);
    res.status(200).json(result);
}

//----------------------- Get all offers for the home page for mobile version and web version-----------------------
export const c_getAllOffersForHomePage = async (req:Request , res:Response) =>{
    const result = await s_getAllOffers(req, res);
    res.status(200).json(result);

}

//----------------------- home offer -----------------------
export const c_homeOffers = async (req:Request , res:Response) =>{
    const result = await s_homeOffers(req, res);
    res.status(200).json(result);

}


