import e, { Request, Response } from "express";
import { Products } from "../entities/products/Products";
import { PackageCustomizations } from "../entities/packages/PackageCustomizations";
import { Brands } from "../entities/Brands";
import { SubCategories } from "../entities/categories/SubCategories";
import { Packages } from "../entities/packages/Packages";
import { PackageProduct } from "../entities/PackageProduct";
import { ProductCustomizations } from "../entities/products/ProductCustomizations";
import { Offers } from "../entities/Offers";

export const getPackageList = async (req: Request, res: Response) => {
    try {
        const packages = await Packages.find();
        if (packages.length === 0) {
            return res.status(404).json({ message: 'No packages found' });
        }

        const packagesList = packages.map(pkg => {
            return {
                PackageID: pkg.PackageID,
                PackageName: pkg.Name,
                PackagePrice: pkg.Price,
                PackageImage: pkg.Resource[0],
                PackageSubCategory: pkg.SubCategory.Name,
                PackageCategory: pkg.SubCategory.Category.Name,
                PackageReview: pkg.Review.map(review => {
                    let sum = 0;
                    sum += review.Rating;
                    if (pkg.Review.length === 0) {
                        return {
                            avgRating: 0,
                        }
                    } else if (pkg.Review[pkg.Review.length - 1].ReviewID == review.ReviewID) {
                        return {
                            avgRating: sum / pkg.Review.length,
                        }
                    }
                })
            };
        });

        if (!packagesList) {
            return res.status(404).json({ message: 'No packages found' });
        }
        res.status(200).send(packagesList);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}

export const getPackageInDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pkg = await Packages.findOne({
            where: { PackageID: Number(id) },
            relations: ['Offer', 'SubCategory', 'SubCategory.Category', 'Review', 'Review.User']
        });
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }

        const packageDetials = {
            PackageID: pkg.PackageID,
            PackageName: pkg.Name,
            PackagePrice: pkg.Price,
            PackageDescription: pkg.Description,
            PackageValidity: pkg.Validity,
            PackageQuantity: pkg.Quantity,
            PackageMessage: pkg.Message,
            PackageSize: pkg.Size,
            PackageStatus: pkg.Status,
            PackageOffer: pkg.Offer,
            PackageSubCategory: pkg.SubCategory.Name,
            PackageCategory: pkg.SubCategory.Category.Name,
            PackageCustomization: pkg.PackageCustomization.map(customization => {
                return {
                    CustomizationID: customization.PackageCustomizationID,
                    CustomizaionOption: customization.Options,

                }
            }),
            PackageResource: pkg.Resource,
            PackageReview: pkg.Review.map(review => {
                return {
                    ReviewID: review.ReviewID,
                    ReviewRating: review.Rating,
                    ReviewComment: review.Comment,
                    ReviewUser: review.User
                }
            })
        }

        res.status(200).send(packageDetials);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}


export const createPackage = async (req: Request, res: Response) => {
    try {
        const {
            Name, Description, Price, Validity, Quantity, Message, Size, Status, SubCategoryID, OfferID, PackageCustomizationID, ResourceID, Products
        } = req.body;

        const subcategory = await SubCategories.findOne({ where: { SubCategoryID } });
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const offer = await Offers.findOne({ where: { OfferID } });
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        const packageCustomization = await PackageCustomizations.findOne({ where: { PackageCustomizationID } });
        if (!packageCustomization) {
            return res.status(404).json({ message: 'Package customization not found' });
        }

        const products = await Products.findByIds(Products);
        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }

        const pkg = Packages.create({
            Name: Name,
            Description: Description,
            Price: Price,
            Validity: Validity,
            Quantity: Quantity,
            Message: Message,
            Size: Size,
            Status: Status,
            SubCategory: subcategory,
            Offer: offer,
            PackageCustomization: [packageCustomization],
            Resource: [ResourceID],
        });
        pkg.Product.push(...products);
        await pkg.save();

        res.status(201).json({ message: 'Package created successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }




}


export const updatePackage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pkg = await Packages.findOne({ where: { PackageID: Number(id)} });
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }

        const { Name, Description, Price, Validity, Quantity, Message, Size, Status, SubCategoryID, OfferID, PackageCustomizationID, ResourceID, Products } = req.body;

        const subcategory = await SubCategories.findOne({ where: { SubCategoryID } });
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const offer = await Offers.findOne({ where: { OfferID } });
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        const packageCustomization = await PackageCustomizations.findOne({ where: { PackageCustomizationID } });
        if (!packageCustomization) {
            return res.status(404).json({ message: 'Package customization not found' });
        }

        const products = await Products.findByIds(Products);
        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }

        pkg.Name = Name;
        pkg.Description = Description;
        pkg.Price = Price;
        pkg.Validity = Validity;
        pkg.Quantity = Quantity;
        pkg.Message = Message;
        pkg.Size = Size;
        pkg.Status = Status;
        pkg.SubCategory = subcategory;
        pkg.Offer = offer;
        pkg.PackageCustomization.push(packageCustomization);
        pkg.Resource.push(ResourceID);
        pkg.Product.push(...products);
        await pkg.save();

        res.status(200).json({ message: 'Package updated successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}

