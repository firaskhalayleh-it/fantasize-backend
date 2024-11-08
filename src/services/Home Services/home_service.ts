import express from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { In } from 'typeorm';


//----------------------- get new arrivals -----------------------
export const s_getNewArrivals = async (req: express.Request, res: express.Response) => {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const newArrivals = await Products.createQueryBuilder("Products")
            .leftJoinAndSelect("Products.Resource", "Resources")
            .where("Products.CreatedAt >= :threeDaysAgo", { threeDaysAgo })
            .orderBy("Products.CreatedAt", "DESC")
            .limit(10)
            .getMany();

        res.status(200).json(newArrivals);
        return newArrivals;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}


//----------------------- get recommended for you -----------------------
export const s_getRecommendedForYou = async (req: express.Request, res: express.Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        if (!userId) {
            return res.status(400).send({ message: "User ID not found" });
        }
        console.log(`userId is : ${userId}`);

        // Step 1: Get SubCategory IDs of products the user has previously ordered
        const userSubcategories = await OrdersProducts.find({
            where: { Order: { User: { UserID: userId } }, },
            relations: ["Product", "Product.SubCategory"],
        });

        const subCategoryIds = userSubcategories.map((orderProduct) => orderProduct.Product.SubCategory.SubCategoryID);

        // Step 2: Fetch recommended products based on the subcategories
        const recommendedProducts = await Products.find({
            where: { SubCategory: { SubCategoryID: In(subCategoryIds) } },
            relations: ["Resource"],
            take: 10,
        });

        res.status(200).json(recommendedProducts);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};
