import { Products } from "../entities/products/Products";
import { Request, Response } from "express";




export const getProductsList = async (req: Request, res: Response) => {
    try {
        const products = await Products.find();
        if (!products) {
            return res.status(404).json({ message: 'No products found' });
        }

        const productsList = products.map(product => {
            let sum = 0;
            return {
                ProductID: product.ProductID,
                ProductName: product.Name,
                ProductPrice: product.Price,
                ProductImage: product.Resource[0],
                ProductSubCategory: product.SubCategory.Name,
                ProductCategory: product.SubCategory.Category.Name,
                ProductReview: product.Review.map(review => {
                    sum += review.Rating;
                    if (product.Review.length === 0) {
                        return {
                            avgRating: 0,
                        }
                    } else if (product.Review[product.Review.length - 1].ReviewID == review.ReviewID) {
                        return {
                            avgRating: sum / product.Review.length,
                        }
                    }
                })
            };
        });

        if (!productsList) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.status(200).send(productsList);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}


export const getProductInDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Products.findOne({ where: { ProductID: Number(id) } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}