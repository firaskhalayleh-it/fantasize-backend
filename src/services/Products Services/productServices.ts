import { Request, Response } from "express";
import { Products } from "../../entities/products/Products";
import { Brands } from "../../entities/Brands";
import { SubCategories } from "../../entities/categories/SubCategories";
import { Offers } from "../../entities/Offers";
import { EntityManager, getRepository, In, Like } from "typeorm";
import { Resources } from "../../entities/Resources";
import { Categories } from "../../entities/categories/Categories";
import { MaterialProduct } from "../../entities/products/MaterialProduct";
import { Material } from "../../entities/Material";
import { OrdersProducts } from "../../entities/products/OrdersProducts";
import { Packages } from "../../entities/packages/Packages";
import { database } from "../../config/database";
import { unlink } from 'node:fs/promises';
import path from "path";
// import { } from "../Resources Services/resourceService";
// import { uploadFiles } from "../../config/Multer config/multerConfig";


// ---------------------> Get all products <---------------------
export const s_getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.find({ relations: ['Review', 'Offer', 'Review', 'Review.User', 'Review.User.UserProfilePicture'] });
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
        const product = await Products.findOne({
            where: { ProductID: productId }, relations: ['Review', 'Review.User', 'Review.User.UserProfilePicture', 'Offer',
                'Resource', 'SubCategory', 'SubCategory.Category', 'Brand',
            ]
        });

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
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory', 'Offer'] });
        if (products.length == 0) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
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
        const products = await Products.find({
            where: { SubCategory: { Category: { CategoryID: CategoryID } } }, relations: ['SubCategory',
                'Offer'
            ]
        });
        if (!products) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


// ---------------------> Create a new product <---------------------
export const s_createProduct = async (req: Request, res: Response) => {
    try {
        const { Name, Price, Description, SubCategoryID, Quantity, BrandID } = req.body;

        if (!Name || !Price || !Description || !SubCategoryID || !Quantity || !BrandID) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const productExisted = await Products.findOne({ where: { Name } });
        if (productExisted) {
            return res.status(409).send({ message: "Product already exists" });
        }

        const brand = await Brands.findOne({ where: { BrandID: BrandID } });
        if (!brand) {
            return res.status(400).send({ message: "Brand not found" });
        }

        const subCategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryID } });
        if (!subCategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        const images = files?.['images'] ?? [];
        const videos = files?.['videos'] ?? [];

        if (images.length === 0 && videos.length === 0) {
            return res.status(400).send({ message: "Please provide at least one image or video" });
        }






        let product: Products;
        product = Products.create({
            Name: String(Name),
            Price: Number(Price),
            Description: String(Description),
            Quantity: Number(Quantity),
            Brand: brand,
            SubCategory: subCategory,
        });

        await product.save();

        const resources = Resources;

        const imageResources = await Promise.all(images.map(async (image) => {
            const resource = resources.create({
                entityName: image.filename,
                filePath: image.path,
                fileType: image.mimetype,
                Product: product
            });
            return await resources.save(resource);
        }));

        const videoResources = await Promise.all(videos.map(async (video) => {
            const resource = resources.create({
                entityName: video.filename,
                filePath: video.path,
                fileType: video.mimetype,
                Product: product
            });
            return await resources.save(resource);
        }));

        return res.status(200).send({ message: "Product created successfully" });

    } catch (err: any) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};



// ---------------------> Update a product <---------------------


// src/controllers/productController.ts


// ---------------------> Update a product <---------------------
export const s_updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.productId;
        const {
            Name,
            Price,
            Description,
            SubCategoryID,
            Quantity,
            BrandID,
            existingImageIDs,
            existingVideoIDs
        } = req.body;

        console.log('Requested body:', req.body);

        if (!productId) {
            return res.status(400).json({ message: "Please provide a product ID" });
        }

        await database.manager.transaction(async (transactionalEntityManager: EntityManager) => {
            // Fetch the product
            const product = await transactionalEntityManager.findOne(Products, {
                where: { ProductID: Number(productId) },
                relations: ["Resource"],
            });

            if (!product) {
                throw { status: 404, message: "Product not found" };
            }

            // Update product fields using update() method
            const productUpdateData: Partial<Products> = {};

            if (Name) {
                // Check for duplicate product name
                const existingProduct = await transactionalEntityManager.findOne(Products, { where: { Name } });
                if (existingProduct && existingProduct.ProductID !== product.ProductID) {
                    throw { status: 409, message: "Product name already exists" };
                }
                productUpdateData.Name = Name;
            }

            if (Price !== undefined && Price !== null) productUpdateData.Price = Number(Price);
            if (Description !== undefined && Description !== null) productUpdateData.Description = Description;
            if (Quantity !== undefined && Quantity !== null) productUpdateData.Quantity = Number(Quantity);

            if (BrandID) {
                const brand = await transactionalEntityManager.findOne(Brands, { where: { BrandID: Number(BrandID) } });
                if (!brand) {
                    throw { status: 404, message: "Brand not found" };
                }
                productUpdateData.Brand = brand;
            }

            if (SubCategoryID) {
                const subCategory = await transactionalEntityManager.findOne(SubCategories, { where: { SubCategoryID: Number(SubCategoryID) } });
                if (!subCategory) {
                    throw { status: 404, message: "SubCategory not found" };
                }
                productUpdateData.SubCategory = subCategory;
            }

            // Apply product updates
            if (Object.keys(productUpdateData).length > 0) {
                await transactionalEntityManager.update(Products, { ProductID: Number(productId) }, productUpdateData);
                console.log("Product updated:", productId);
            }

            // Parse existing resource IDs
            let existingImageIDsArray: number[] = [];
            let existingVideoIDsArray: number[] = [];

            if (existingImageIDs) {
                try {
                    existingImageIDsArray = JSON.parse(existingImageIDs);
                    if (!Array.isArray(existingImageIDsArray)) {
                        throw new Error("existingImageIDs is not an array");
                    }
                    existingImageIDsArray = existingImageIDsArray.map(id => Number(id));
                } catch (e) {
                    console.error("Error parsing existingImageIDs:", e);
                    throw { status: 400, message: "Invalid format for existingImageIDs" };
                }
            }

            if (existingVideoIDs) {
                try {
                    existingVideoIDsArray = JSON.parse(existingVideoIDs);
                    if (!Array.isArray(existingVideoIDsArray)) {
                        throw new Error("existingVideoIDs is not an array");
                    }
                    existingVideoIDsArray = existingVideoIDsArray.map(id => Number(id));
                } catch (e) {
                    console.error("Error parsing existingVideoIDs:", e);
                    throw { status: 400, message: "Invalid format for existingVideoIDs" };
                }
            }

            console.log("Parsed existingImageIDsArray:", existingImageIDsArray);
            console.log("Parsed existingVideoIDsArray:", existingVideoIDsArray);

            // Retrieve all existing resources associated with the product
            const existingResources = await transactionalEntityManager.find(Resources, {
                where: { Product: { ProductID: Number(productId) } }
            });

            console.log("Existing resources:", existingResources.map(r => ({ id: r.ResourceID, name: r.entityName })));

            // Separate existing images and videos
            const existingImageResources = existingResources.filter(r => r.fileType.startsWith('image/'));
            const existingVideoResources = existingResources.filter(r => r.fileType.startsWith('video/'));

            // Determine which image resources to delete
            const imageResourcesToDelete = existingImageResources.filter(r => !existingImageIDsArray.includes(r.ResourceID));

            // Determine which video resources to delete
            const videoResourcesToDelete = existingVideoResources.filter(r => !existingVideoIDsArray.includes(r.ResourceID));

            console.log("Image Resources to delete:", imageResourcesToDelete.map(r => r.ResourceID));
            console.log("Video Resources to delete:", videoResourcesToDelete.map(r => r.ResourceID));

            // Delete image resources
            for (const resource of imageResourcesToDelete) {
                console.log("Deleting image resource:", resource.ResourceID, resource.filePath);
                const deleteResult = await transactionalEntityManager.delete(Resources, { ResourceID: resource.ResourceID });
                console.log(`Delete Result for ResourceID ${resource.ResourceID}:`, deleteResult);

                if (deleteResult.affected && deleteResult.affected > 0) {
                    const normalizedFilePath = resource.filePath.replace(/\\/g, "/");
                    const absoluteFilePath = path.resolve(__dirname, '../../../', normalizedFilePath);

                    console.log("Deleting image file at:", absoluteFilePath);
                    try {
                        await unlink(absoluteFilePath); // No callback, just await the promise
                        console.log(`Deleted image file: ${absoluteFilePath}`);
                    } catch (err: any) {
                        if (err.code === 'ENOENT') {
                            console.warn(`Image file not found: ${absoluteFilePath}`);
                        } else {
                            console.error(`Failed to delete image file: ${absoluteFilePath}`, err);
                            throw { status: 500, message: `Failed to delete image file: ${absoluteFilePath}` };
                        }
                    }
                } else {
                    console.warn(`No image record found with ResourceID: ${resource.ResourceID}`);
                }
            }

            // Delete video resources
            for (const resource of videoResourcesToDelete) {
                console.log("Deleting video resource:", resource.ResourceID, resource.filePath);
                const deleteResult = await transactionalEntityManager.delete(Resources, { ResourceID: resource.ResourceID });
                console.log(`Delete Result for ResourceID ${resource.ResourceID}:`, deleteResult);

                if (deleteResult.affected && deleteResult.affected > 0) {
                    const normalizedFilePath = resource.filePath.replace(/\\/g, "/");
                    const absoluteFilePath = path.resolve(__dirname, '../../../', normalizedFilePath);

                    console.log("Deleting video file at:", absoluteFilePath);
                    try {
                        await unlink(absoluteFilePath); // No callback, just await the promise
                        console.log(`Deleted video file: ${absoluteFilePath}`);
                    } catch (err: any) {
                        if (err.code === 'ENOENT') {
                            console.warn(`Video file not found: ${absoluteFilePath}`);
                        } else {
                            console.error(`Failed to delete video file: ${absoluteFilePath}`, err);
                            throw { status: 500, message: `Failed to delete video file: ${absoluteFilePath}` };
                        }
                    }
                } else {
                    console.warn(`No video record found with ResourceID: ${resource.ResourceID}`);
                }
            }

            // Handle uploaded files (images and videos)
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            const images = files?.images || [];
            const videos = files?.videos || [];

            console.log("Uploaded images:", images.map(f => f.filename));
            console.log("Uploaded videos:", videos.map(f => f.filename));

            // Add new image resources using insert()
            for (const image of images) {
                const resourceExists = existingImageResources.some(r => r.entityName === image.filename);
                if (!resourceExists) {
                    const insertResult = await transactionalEntityManager.insert(Resources, {
                        entityName: image.filename,
                        filePath: `resources/${image.filename}`,
                        fileType: image.mimetype,
                        Product: { ProductID: Number(productId) }
                    });
                    console.log("Inserted new image resource:", insertResult.identifiers);
                } else {
                    console.log("Image resource already exists:", image.filename);
                }
            }

            // Add new video resources using insert()
            for (const video of videos) {
                const resourceExists = existingVideoResources.some(r => r.entityName === video.filename);
                if (!resourceExists) {
                    const insertResult = await transactionalEntityManager.insert(Resources, {
                        entityName: video.filename,
                        filePath: `resources/${video.filename}`,
                        fileType: video.mimetype,
                        Product: { ProductID: Number(productId) }
                    });
                    console.log("Inserted new video resource:", insertResult.identifiers);
                } else {
                    console.log("Video resource already exists:", video.filename);
                }
            }

            console.log("Update transaction completed successfully.");
        });

        // After transaction, fetch updated product with resources
        const updatedProduct = await database.getRepository(Products).findOne({
            where: { ProductID: Number(productId) },
            relations: ["Resource", "SubCategory", "SubCategory.Category", "Brand", "Offer", "Review", "Review.User", "Review.User.UserProfilePicture"]
        });

        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            updatedProduct
        });
    } catch (error: any) {
        console.error("Error in s_updateProduct:", error);
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message, success: false });
        }
        return res.status(500).json({ message: "An internal server error occurred", success: false });
    }
};
// --------------------- get 5 random products under men category ---------------------
export const s_getRandomMenProducts = async (req: Request, res: Response) => {
    try {
        const menCategory = await Categories.findOne({ where: { Name: 'Mens' } });
        if (!menCategory) {
            return res.status(404).send({ message: "no category found" });
        }
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: menCategory.CategoryID } } }, relations: ['SubCategory', 'Offer',] });
        if (!products) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

// --------------------- get 5 random products under women category ---------------------
export const s_getRandomWomenProducts = async (req: Request, res: Response) => {
    try {
        const womenCategory = await Categories.findOne({ where: { Name: 'Womens' } });
        if (!womenCategory) {
            return res.status(404).send({ message: "no category found" });
        }
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: womenCategory.CategoryID } } }, relations: ['SubCategory', 'Offer',] });
        if (!products) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


// ---------------------  delete product ---------------------
export const s_deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        if (!productId) {
            return res.status(400).send({ message: "Please provide a product ID" });
        }
        const productRepository = (Products);
        const product = await productRepository.findOne({ where: { ProductID: productId } });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        const isOrdered = await OrdersProducts.findOne({ where: { Product: { ProductID: productId } } });
        if (isOrdered) {
            return res.status(400).send({ message: "Product cannot be deleted because it is already ordered" });
        }

        const isPackage = await Packages.findOne({ where: { PackageProduct: { Product: { ProductID: productId } } } });
        if (isPackage) {
            return res.status(400).send({ message: "Product cannot be deleted because it is already in a package" });
        }

        await productRepository.delete({ ProductID: productId });

        return "Product deleted successfully";
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
}



// ---------------------  get last product created ---------------------
export const s_getLastProduct = async (req: Request, res: Response) => {
    try {
        const product = await Products.findOne({ where: {}, order: { ProductID: "DESC" }, relations: ['SubCategory', 'Offer'] });
        if (!product) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        return product;
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}
