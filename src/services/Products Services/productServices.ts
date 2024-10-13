import { Request, Response } from "express";
import { Products } from "../../entities/products/Products";
import { Brands } from "../../entities/Brands";
import { SubCategories } from "../../entities/categories/SubCategories";
import { Offers } from "../../entities/Offers";
import { getRepository } from "typeorm";
import {  Resources } from "../../entities/Resources";
// import { } from "../Resources Services/resourceService";
// import { uploadFiles } from "../../config/Multer config/multerConfig";


// ---------------------> Get all products <---------------------
export const s_getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.find({ relations: ['Review'] }); // Assuming 'Review' is a relation
        if (!products || products.length === 0) {
            return res.status(404).send({ message: "No Products Found!" });
        }

        return res.status(200).send(products);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send({ message: "An error occurred while fetching products.", error: err.message });
    }
};


// ---------------------> Get product by id <---------------------
export const s_getProduct = async (req: Request, res: Response) => {
    try {
        const productId: any = req.params.id;
        const product = await Products.findOne({ where: { ProductID: productId } })
        if (!product) {
            return "The Product Not Found !";
        }
        return product;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

// ---------------------> Get product by category and sub category<---------------------
export const s_getProductByCategoryAndSubCategory = async (req: Request, res: Response) => {
    try {
        const CategoryID: any = req.params.CategoryID;
        const subCategoryID: any = req.params.subCategoryID;
        if (!CategoryID || !subCategoryID) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory'] });
        if (products.length==0 ) {
            return "The Product Not Found !";
        }
        return products;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

// ---------------------> Get product by category <---------------------
export const s_getProductByCategoryID = async (req: Request, res: Response) => {
    try {
        const CategoryID: any = req.params.CategoryID;
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: CategoryID } } }, relations: ['SubCategory'] });
        if (!products) {
            return "The Product Not Found !";
        }
        return products;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


// ---------------------> Create a new product <---------------------


export const s_createProduct = async (req: Request, res: Response) => {
    try {
        const { Name, Price, Description, SubCategoryID, Quantity, BrandName, Material } = req.body;

        if (!Name || !Price || !Description || !SubCategoryID || !Quantity || !BrandName || !Material) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const isExist = await Products.findOne({where:{Name:Name}});
        if(isExist){
            return `the product '${Name}' is already exist.`
        }
        const brand = await Brands.findOne({ where: { Name: BrandName } });
        if (!brand) {
            return res.status(400).send({ message: "Brand not found" });
        }

        const subCategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryID } });
        if (!subCategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        // Safely access req.files and handle cases where it might be undefined
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        // Initialize images and videos as empty arrays if they do not exist
        const images = files?.['images'] ?? [];
        const videos = files?.['videos'] ?? [];

        // Check if both arrays are empty
        if (images.length === 0 && videos.length === 0) {
            return res.status(400).send({ message: "Please provide at least one image or video" });
        }

        // Create the product entity
        const product = Products.create({
            Name: String(Name),
            Price: Number(Price),
            Description,
            Material,
            Quantity: Number(Quantity),
            Brand: brand,
            SubCategory: subCategory,
        });

        // Save the product before associating resources
        await product.save();

        const resources = Resources;
        const imageResources = await Promise.all(images.map(async (image) => {
            const resource = resources.create({
                entityName: image.filename,
                filePath: image.path,
                fileType: image.mimetype,
                Product: product // Associate product with resource
            });
            return await resources.save(resource);
        }));

        const videoResources = await Promise.all(videos.map(async (video) => {
            const resource = resources.create({
                entityName: video.filename,
                filePath: video.path,
                fileType: video.mimetype,
                Product: product // Associate product with resource
            });
            return await resources.save(resource);
        }));

        await product.save();


        return res.status(201).send({ message: "Product created successfully" });

    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};


// ---------------------> Update a product <---------------------


export const s_updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const { Name, Price, Description, SubCategoryID, Quantity, BrandName, Material } = req.body;

        const productRepository = (Products);
        const product = await productRepository.findOne({ where: { ProductID: productId }, relations: ["Resource",] });
        
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Update product fields if provided
        if (Name && Name !== product.Name) {
            const existingProduct = await productRepository.findOne({ where: { Name } });
            if (existingProduct) {
                return res.status(409).send({ message: "Product name already exists" });
            }
            product.Name = Name;
        }
        if (Price) product.Price = Number(Price);
        if (Description) product.Description = Description;
        if (Material) product.Material = Material;
        if (Quantity) product.Quantity = Number(Quantity);

        // Update brand if 
        if (BrandName) {
            const brand = await Brands.findOne({ where: { Name: BrandName } });
            if (!brand) {
                return res.status(404).send({ message: "Brand not found" });
            }
            product.Brand = brand;
        }

        if (SubCategoryID) {
            const subCategory = await SubCategories.findOne({ where: { SubCategoryID } });
            if (!subCategory) {
                return res.status(404).send({ message: "SubCategory not found" });
            }
            product.SubCategory = subCategory;
        }
        

        await productRepository.save(product);

        return   "Product updated successfully" ;
    } catch (err: any) {
        if (err.code === '23505') {
            console.error("Unique constraint violation:", err.detail);
            return res.status(409).send({
                message: "A product with the same unique attribute already exists.",
                detail: err.detail
            });
        }
        console.log(err);
        return res.status(500).send({ message: "An error occurred", error: err.message });
    }
};
