import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { FavoriteProducts } from '../../entities/products/FavoriteProducts';

//----------------------- Add a product to favorites-----------------------
export const s_addProductFavorites = async (req:Request , res:Response) =>{
    try {
        const productId = Number(req.params.productId);
        const  userId  = (req as any).user.payload.userId;
        
        const product = await Products.findOne({ where: { ProductID: productId } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const favoriteProduct = await FavoriteProducts.findOne({ where: { Product: {ProductID:productId}, User: {UserID:userId} } });
        if(favoriteProduct){
            return res.status(400).send({ message: "Product already in favorites" });
        }
        const addFavoriteProduct = FavoriteProducts.create({
            Product: product,
            User: userId
        });
        await addFavoriteProduct.save();

        return "product added to favorites";

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message, userId:(req as any).user.payload.userId, productId:req.params.productId })
    }

} 

//----------------------- Get all favorite products for a user-----------------------
export const s_getAllFavoriteProductsUser = async (req:Request , res:Response) =>{
    try {
        const { userId } = (req as any).user.payload.userId;
        const favoriteProducts = await FavoriteProducts.find({ where: { User: {UserID:userId}, } ,relations: ["Product"] });
        if (!favoriteProducts) {
            return res.status(404).send({ message: "No favorite products found" });
        }
        return favoriteProducts;
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 


//----------------------- Remove a product from favorites-----------------------
export const s_removeProductFavorites = async (req:Request , res:Response) =>{
    try {
        const productId = Number(req.params.productId);
        const { userId } = (req as any).user.payload.userId;

        const product = await Products.findOne({ where: { ProductID: productId } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const favoriteProduct = await FavoriteProducts.findOne({ where: { Product: {ProductID:productId}, User: {UserID:userId} } });
        if(!favoriteProduct){
            return res.status(400).send({ message: "Product not in favorites" });
        }
        await favoriteProduct.remove();

        return "product removed from favorites";
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 