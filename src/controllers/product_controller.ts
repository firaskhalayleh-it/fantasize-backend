import { Products } from "../entities/products/Products";
import { Request, Response } from "express";
import { Between } from "typeorm";
import { Brands } from "../entities/Brands";
import { SubCategories } from "../entities/categories/SubCategories";
import { ProductCustomizations } from "../entities/products/ProductCustomizations";




export const getProductsList = async (req: Request, res: Response) => {
    try {
        const products = await Products.find();
        if (products.length === 0) {
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

        const product = await Products.findOne({
            where: { ProductID: Number(id) },
            relations: ['Brand', 'SubCategory', 'SubCategory.Category', 'Review', 'Review.User']
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.Quantity <= 5) {
            product!.Status = 'running low';
            await product.save();
            return res.status(200).json({ message: 'Only few products left' });

        } else if (product.Quantity === 0) {
            product!.Status = 'out of stock';
            await product.save();
            return res.status(200).json({ message: 'Product is out of stock' });
        }

        const productDetail = {
            ProductID: product.ProductID,
            ProductName: product.Name,
            ProductDescription: product.Description,
            ProductPrice: product.Price,
            ProductQuantity: product.Quantity,
            ProductSize: product.Size,
            ProductStatus: product.Status,
            ProductMessage: product.Message,
            ProductMaterial: product.Material,
            ProductBrand: product.Brand ? product.Brand.Name : 'Unknown Brand',
            ProductSubCategory: product.SubCategory ? product.SubCategory.Name : 'Unknown SubCategory',
            ProductCategory: product.SubCategory && product.SubCategory.Category ? product.SubCategory.Category.Name : 'Unknown Category',
            ProductReview: product.Review ? product.Review.map(review => {
                return {
                    ReviewID: review.ReviewID,
                    ReviewRating: review.Rating,
                    ReviewComment: review.Comment,
                    ReviewUser: review.User ? review.User.Username + ' ' + review.User.UserProfilePicture : 'Anonymous',
                };
            }) : [],

            ProductCustomizations: product.ProductCustomization ? product.ProductCustomization.map(customization => {
                return {
                    CustomizationID: customization.ProductCustomizationID,
                    CustomizationOptionName: customization.OptionName,
                    CustomizationOptionValue: customization.OptionValue,

                };
            }) : [],
        };



        res.status(200).send(productDetail);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}


export const addNewProduct = async (req: Request, res: Response) => {
    try {
        const { Name, Description, Price, Quantity, Size, Status, Message, Material, BrandName, SubCategoryID } = req.body;
        let brand = await Brands.findOne({ where: { Name: BrandName } });
        if (!brand) {
            brand = Brands.create({ Name: BrandName });
            brand.save();
        } else {
            const subcategory = await SubCategories.findOne({ where: { SubCategoryID } });
            if (!subcategory) {
                return res.status(404).json({ message: 'Subcategory not found' });
            }
            const product = Products.create({
                Name: Name,
                Description: Description,
                Price: Price,
                Quantity: Quantity,
                Size: Size,
                Status: Status,
                Message: Message,
                Material: Material,
                Brand: brand,
                SubCategory: subcategory
            });
            await product.save();
        }
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}


export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Products.findOne({ where: { ProductID: Number(id) } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { Name, Description, Price, Quantity, Size, Status, Message, Material, BrandID, SubCategoryID ,CustomizationID} = req.body;
        const customization = await ProductCustomizations.findOne({ where: { ProductCustomizationID: CustomizationID } });
        if (!customization) {
            return res.status(404).json({ message: 'Customization not found' });
        }
        const brand = await Brands.findOne({ where: { BrandID } });
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        const subcategory = await SubCategories.findOne({ where: { SubCategoryID } });
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        product.Name = Name;
        product.Description = Description;
        product.Price = Price;
        product.Quantity = Quantity;
        product.Size = Size;
        product.Status = Status;
        product.Message = Message;
        product.Material = Material;
        product.Brand = brand;
        product.SubCategory = subcategory;
        product.UpdatedAt = new Date();
        product.ProductCustomization.push(customization);
        await product.save();
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }

}



