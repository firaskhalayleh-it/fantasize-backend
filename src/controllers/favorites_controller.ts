import { Request, Response } from "express";
import { Products } from "../entities/products/Products";
import { Users } from "../entities/users/Users";
import { FavoriteProducts } from "../entities/products/FavoriteProducts";


export const getFavoriteProducts = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies;

        
        const user = await Users.findOne({ where: { UserID: cookie.user.UserID }, relations: ['FavoriteProducts'] });
        if (!user) {
            return res.status(404).json({ message: 'you must login first!' });
        }


        const favoriteProducts = await FavoriteProducts.findOne({ where: { User: { UserID: user.UserID } } });
        if (!favoriteProducts) {
            return res.status(404).json({ message: 'No favorite products found' });
        }

        res.status(200).json(favoriteProducts.Product);




    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });

    }
}


export const addFavoriteProduct = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['UserID'];
        const user = await Users.findOne({ where: { UserID: cookie.user.UserID } });
        if (!user) {
            return res.status(404).json({ message: 'you must login first!' });
        }
        const { ProductID } = req.body;
        const product = await Products.findOne({ where: { ProductID } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
       
        const isFavorite = await FavoriteProducts.findOne({ where: { User: { UserID: user.UserID }, Product: { ProductID } } });
        if (isFavorite) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }else{
            const favoriteProduct = FavoriteProducts.create({
                User: user,
                Product: [product]
            });
            await favoriteProduct.save();
            res.status(201).json({ message: 'Product added to favorites' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error: error });

    }
}


export const removeFavoriteProduct = async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies;
        const user = await Users.findOne({ where: { UserID: cookie.user.UserID } });
        if (!user) {
            return res.status(404).json({ message: 'you must login first!' });
        }
        const { ProductID } = req.body;
        const product = await Products.findOne({ where: { ProductID } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const favoriteProduct = await FavoriteProducts.findOne({ where: { User: { UserID: user.UserID }, Product: { ProductID } } });
        if (!favoriteProduct) {
            return res.status(404).json({ message: 'Product not in favorites' });
        }else{
            await favoriteProduct.remove();
            res.status(200).json({ message: 'Product removed from favorites' });
        }
       
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });

    }   
}