import { Products } from "../entities/products/Products";
import { Request, Response } from "express";
import { Between } from "typeorm";



export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        const products = await Products.find({ where: { SubCategory: { Category: { Name: category } } } });
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

export const getProducsBySubCategory = async (req: Request, res: Response) => {
    try {
        const { subCategory } = req.params;

        const products = await Products.find({ where: { SubCategory: { Name: subCategory } } });
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


export const getProductsByPriceRange = async (req: Request, res: Response) => {
    try {
        const { min, max } = req.params;


        const products = await Products.find({
            where: {
                Price: Between(Number(min), Number(max))
            }
        }); if (!products) {
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

export const getProductsByMaterial = async (req: Request, res: Response) => {
    try {
        const { material } = req.params;

        const products = await Products.find({ where: { Material: material } });
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

export const getProductsBySize = async (req: Request, res: Response) => {
    try {
        const { size } = req.params;

        const products = await Products.find({ where: { Size: size } });
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

export const getProductsByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;

        const products = await Products.find({ where: { Status: status } });
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

export const getProductsByBrand = async (req: Request, res: Response) => {
    try {
        const { brand } = req.params;

        const products = await Products.find({ where: { Brand: { Name: brand } } });
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