import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { FavoriteProducts } from '../../entities/products/FavoriteProducts';
import { Users } from '../../entities/users/Users';

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
export const s_getAllFavoriteProductsUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userId } });
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const favoriteProducts = await FavoriteProducts.find({ 
            where: { User: { UserID: userId } }, 
        });
        if (favoriteProducts.length === 0) {
            return res.status(404).send({ message: "No favorite products found" });
        }

       
        return res.status(200).send(favoriteProducts);
    
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};



//----------------------- Remove a product from favorites-----------------------
export const s_removeProductFavorites = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const userId = (req as any).user.payload.userId;

        // Validate product existence
        const productRepository = (Products);
        const product = await productRepository.findOne({ where: { ProductID: productId } });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find the favorite entry
        const favoriteRepository = (FavoriteProducts);
        const favoriteProduct = await favoriteRepository.findOne({
            where: {
                Product: { ProductID: productId },
                User: { UserID: userId }
            },
            relations: ["Product", "User"] // Ensure relations are loaded
        });

        if (!favoriteProduct) {
            return res.status(400).json({ message: "Product not in favorites" });
        }

        // Remove the favorite entry
        await favoriteRepository.remove(favoriteProduct);

        return res.status(200).json({ message: "Product removed from favorites" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};