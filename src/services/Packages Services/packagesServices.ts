import { Request, Response } from 'express';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { EntityManager, In, Like, Not } from 'typeorm';
import { database } from '../../config/database';
import { PackageProduct } from '../../entities/packages/packageProduct';
import fs from "fs/promises"; // Use fs.promises for async/await
import path from "path";
import { getRepository } from 'typeorm';
import { Resources } from '../../entities/Resources';
import { Categories } from '../../entities/categories/Categories';
import { Material } from '../../entities/Material';
import { MaterialPackage } from '../../entities/packages/MaterialPackage';


//----------------------- Create a new package-----------------------
export const s_createPackage = async (req: Request, res: Response) => {
    const queryRunner = database.createQueryRunner();

    try {
        await queryRunner.startTransaction();

        const { Name, Description, Price, Quantity, SubCategoryId, products } = req.body;

        if (!Name || !Description || !Price || !Quantity || !SubCategoryId || !products) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "Please fill all the fields" });
        }

        // Parse products if it's a string (as it comes from multipart/form-data)
        let parsedProducts;
        try {
            parsedProducts = JSON.parse(products);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "Invalid products format. Must be a JSON array." });
        }

        // Check if the subcategory exists
        const subcategory = await queryRunner.manager.findOne(SubCategories, { where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "SubCategory not found" });
        }

        // Handle files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const images = files?.['images'] || [];
        const videos = files?.['videos'] || [];

        // Extract product names and quantities
        const productNames = parsedProducts.map((p: { productName: string }) => p.productName);
        const quantities = parsedProducts.map((p: { quantity: number }) => p.quantity);





        // Check if the required products are available in the database
        const productsInDB = await queryRunner.manager.find(Products, { where: { Name: In(productNames) } });
        if (productsInDB.length !== productNames.length) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "Sorry, some products do not exist" });
        }

        // Check and update available quantities for each product
        for (let i = 0; i < productsInDB.length; i++) {
            const productInDB = productsInDB[i];
            const requestedQuantity = quantities[i] * Quantity;

            // Check if there's enough stock
            if (productInDB.Quantity < requestedQuantity) {
                await queryRunner.rollbackTransaction();
                return res.status(400).send({ message: `Insufficient quantity for ${productInDB.Name}` });
            }

            // Update product quantity in stock
            productInDB.Quantity -= requestedQuantity;
            await queryRunner.manager.save(productInDB);
        }

        // Create new package
        const newPackage = queryRunner.manager.create(Packages, {
            Name: Name,
            Description: Description,
            Price: Price,
            Quantity: Quantity,
            SubCategory: subcategory,
        });

        await queryRunner.manager.save(newPackage);

        // Save image resources
        const imageResources = await Promise.all(images.map(async (image) => {
            const resource = queryRunner.manager.create(Resources, {
                entityName: image.filename,
                filePath: `/resources/${image.filename}`,
                fileType: image.mimetype,
                Package: newPackage,
            });
            return await queryRunner.manager.save(resource);
        }));

        // Save video resources
        const videoResources = await Promise.all(videos.map(async (video) => {
            const resource = queryRunner.manager.create(Resources, {
                entityName: video.filename,
                filePath: `/resources/${video.filename}`,
                fileType: video.mimetype,
                Package: newPackage,
            });
            return await queryRunner.manager.save(resource);
        }));

        // Add products with quantities to PackageProduct
        for (let i = 0; i < productsInDB.length; i++) {
            const packageProduct = queryRunner.manager.create(PackageProduct, {
                Package: newPackage,
                Product: productsInDB[i],
                Quantity: quantities[i] * Quantity, // Quantity allocated for each product within the package
                ProductName: productsInDB[i].Name,
            });

            await queryRunner.manager.save(packageProduct);
        }

        await queryRunner.commitTransaction();
        return res.status(201).send({ message: "Package added successfully" });

    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(err);
        return res.status(500).send({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};



//----------------------- Get all packages-----------------------
export const s_getAllPackages = async (req: Request, res: Response) => {
    try {
        const getAllPackages = await Packages.find({ relations: ['PackageProduct', 'Reviews', 'SubCategory', 'Resource', 'Customization', 'Offer'] });
        if (!getAllPackages || getAllPackages.length === 0) {
            return res.status(404).json({ msg: `Not Found Packages` });
        }
        return getAllPackages
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//-----------------------Get all packages under a specific subcategory-----------------------
export const s_getAllPackagesUnderSpecificSubcategory = async (req: Request, res: Response) => {
    try {
        const CategoryID: any = req.params.categoryId;
        const subCategoryID: any = req.params.subcategoryId;
        if (!CategoryID || !subCategoryID) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const pkg = await Packages.find({
            where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } },
            relations: ['SubCategory', 'PackageProduct', 'Reviews']
        });
        if (!pkg) {
            return `the packagies not found`;
        }
        return pkg;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Get a package by ID-----------------------
export const s_getPackageByID = async (req: Request, res: Response) => {
    try {
        const pkgId: any = req.params.packageId;
        const getPackage = await Packages.findOne({
            where: { PackageID: pkgId }, relations: ['PackageProduct', 'Reviews', 'Reviews.User', 'SubCategory', 'Resource', 'Customization',
                'PackageProduct.Product', 'PackageProduct.Product.SubCategory', 'PackageProduct.Product.Resource'
            ]
        });
        if (!getPackage) {
            return `not found a package`
        }
        return getPackage;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Update a package-----------------------
export const s_updatePackage = async (req: Request, res: Response) => {
    try {
        const pkgId = req.params.packageId;
        const { Name, Description, Price, Quantity, SubCategoryId, products, existingImageIDs, existingVideoIDs } = req.body;

        console.log("Requested body:", req.body);

        if (!pkgId) {
            return res.status(400).json({ message: "Please provide a package ID" });
        }

        await database.manager.transaction(async (transactionalEntityManager: EntityManager) => {
            // Fetch the package along with its associated resources and products
            const pkg = await transactionalEntityManager.findOne(Packages, {
                where: { PackageID: Number(pkgId) },
                relations: ["Resource", "PackageProduct", "PackageProduct.Product"],
            });

            if (!pkg) {
                throw { status: 404, message: "Package not found" };
            }

            // Prepare update data
            const packageUpdateData: Partial<Packages> = {};

            if (Name) {
                // Check for duplicate package name
                const existingPackage = await transactionalEntityManager.findOne(Packages, { where: { Name } });
                if (existingPackage && existingPackage.PackageID !== pkg.PackageID) {
                    throw { status: 409, message: "Package name already exists" };
                }
                packageUpdateData.Name = Name;
            }

            if (Description !== undefined && Description !== null) packageUpdateData.Description = Description;
            if (Price !== undefined && Price !== null) packageUpdateData.Price = parseFloat(Price);
            if (Quantity !== undefined && Quantity !== null) packageUpdateData.Quantity = parseInt(Quantity, 10);

            if (SubCategoryId) {
                const subCategory = await transactionalEntityManager.findOne(SubCategories, { where: { SubCategoryID: Number(SubCategoryId) } });
                if (!subCategory) {
                    throw { status: 404, message: "SubCategory not found" };
                }
                packageUpdateData.SubCategory = subCategory;
            }

            // Apply package updates
            if (Object.keys(packageUpdateData).length > 0) {
                await transactionalEntityManager.update(Packages, { PackageID: Number(pkgId) }, packageUpdateData);
                console.log("Package updated:", pkgId);
            }

            // Handle Products Association
            let productsArray: any[] = [];

            if (products) {
                if (typeof products === 'string') {
                    try {
                        productsArray = JSON.parse(products);
                    } catch (e) {
                        console.error("Error parsing products:", e);
                        throw { status: 400, message: "Invalid format for products" };
                    }
                } else if (Array.isArray(products)) {
                    productsArray = products;
                } else {
                    throw { status: 400, message: "Invalid format for products" };
                }
            }

            if (productsArray && Array.isArray(productsArray)) {
                const productIds = productsArray.map((p: { productId: number }) => p.productId);
                const productQuantities = productsArray.map((p: { quantity: number }) => p.quantity);

                // Fetch products from DB
                const dbProducts = await transactionalEntityManager.find(Products, {
                    where: { ProductID: In(productIds) }
                });

                if (dbProducts.length !== productIds.length) {
                    throw { status: 400, message: "Some products do not exist" };
                }

                // Map product IDs to their DB records
                const productMap: { [key: number]: Products } = {};
                dbProducts.forEach(product => {
                    productMap[product.ProductID] = product;
                });

                // Fetch existing PackageProduct entries
                const existingPackageProducts = pkg.PackageProduct || [];

                // Create a Set of current product IDs for easy lookup
                const currentProductIdSet = new Set<number>(productIds);

                // Iterate through the incoming products
                for (let i = 0; i < productsArray.length; i++) {
                    const incomingProduct = productsArray[i];
                    const dbProduct = productMap[incomingProduct.productId];
                    const requestedQuantity = incomingProduct.quantity;

                    if (!dbProduct) {
                        throw { status: 400, message: `Product with ID ${incomingProduct.productId} does not exist` };
                    }

                    // Find existing PackageProduct
                    const existingPP = existingPackageProducts.find(pp => pp.Product.ProductID === dbProduct.ProductID);

                    if (existingPP) {
                        // Calculate the difference in quantity
                        const quantityDifference = requestedQuantity - existingPP.Quantity;
                        console.log(`Product ID ${dbProduct.ProductID}: Existing Quantity = ${existingPP.Quantity}, Requested Quantity = ${requestedQuantity}, Difference = ${quantityDifference}`);

                        if (quantityDifference > 0) {
                            // Need to assign more products, check stock
                            if (dbProduct.Quantity < quantityDifference) {
                                throw { status: 400, message: `Insufficient quantity for product ${dbProduct.Name}` };
                            }
                            dbProduct.Quantity -= quantityDifference;
                        } else if (quantityDifference < 0) {
                            // Need to unassign some products, restore stock
                            dbProduct.Quantity += Math.abs(quantityDifference);
                        }
                        // Update the product stock
                        await transactionalEntityManager.save(dbProduct);

                        // Update the PackageProduct quantity
                        existingPP.Quantity = requestedQuantity;
                        await transactionalEntityManager.save(existingPP);
                        console.log(`Updated PackageProduct for Product ID ${dbProduct.ProductID}: New Quantity = ${existingPP.Quantity}`);
                    } else {
                        // New product association, check stock
                        if (dbProduct.Quantity < requestedQuantity) {
                            throw { status: 400, message: `Insufficient quantity for product ${dbProduct.Name}` };
                        }

                        // Adjust product stock
                        dbProduct.Quantity -= requestedQuantity;
                        await transactionalEntityManager.save(dbProduct);

                        // Create new PackageProduct entry
                        const newPP = transactionalEntityManager.create(PackageProduct, {
                            Package: pkg,
                            Product: dbProduct,
                            Quantity: requestedQuantity,
                            ProductName: dbProduct.Name,
                        });
                        await transactionalEntityManager.save(PackageProduct, newPP);
                        console.log(`Created new PackageProduct for Product ID ${dbProduct.ProductID}: Quantity = ${newPP.Quantity}`);
                    }
                }

                // Remove PackageProducts that are no longer associated
                for (const existingPP of existingPackageProducts) {
                    if (!currentProductIdSet.has(existingPP.Product.ProductID)) {
                        console.log(`Removing PackageProduct for Product ID ${existingPP.Product.ProductID}: Quantity = ${existingPP.Quantity}`);

                        // Restore product stock
                        const product = await transactionalEntityManager.findOne(Products, { where: { ProductID: existingPP.Product.ProductID } });
                        if (product) {
                            product.Quantity += existingPP.Quantity;
                            await transactionalEntityManager.save(product);
                            console.log(`Restored stock for Product ID ${product.ProductID}: New Stock = ${product.Quantity}`);
                        }

                        // Remove PackageProduct entry
                        await transactionalEntityManager.remove(PackageProduct, existingPP);
                        console.log(`Removed PackageProduct for Product ID ${existingPP.Product.ProductID}`);
                    }
                }
            }

            // Handle Resource Deletion
            // Parse existing resource IDs from the request
            let existingImageIDsArray: number[] = [];
            let existingVideoIDsArray: number[] = [];

            if (existingImageIDs) {
                try {
                    existingImageIDsArray = JSON.parse(existingImageIDs);
                    if (!Array.isArray(existingImageIDsArray)) {
                        throw new Error("existingImageIDs is not an array");
                    }
                    existingImageIDsArray = existingImageIDsArray.map((id: any) => Number(id));
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
                    existingVideoIDsArray = existingVideoIDsArray.map((id: any) => Number(id));
                } catch (e) {
                    console.error("Error parsing existingVideoIDs:", e);
                    throw { status: 400, message: "Invalid format for existingVideoIDs" };
                }
            }

            console.log("Parsed existingImageIDsArray:", existingImageIDsArray);
            console.log("Parsed existingVideoIDsArray:", existingVideoIDsArray);

            // Retrieve all existing resources associated with the package
            const existingResources = await transactionalEntityManager.find(Resources, {
                where: { Package: { PackageID: Number(pkgId) } },
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

            // Function to delete resources
            const deleteResources = async (resourcesToDelete: Resources[], type: string) => {
                for (const resource of resourcesToDelete) {
                    console.log(`Deleting ${type} resource:`, resource.ResourceID, resource.filePath);
                    const deleteResult = await transactionalEntityManager.delete(Resources, { ResourceID: resource.ResourceID });
                    console.log(`Delete Result for ResourceID ${resource.ResourceID}:`, deleteResult);

                    if (deleteResult.affected && deleteResult.affected > 0) {
                        let normalizedFilePath = resource.filePath.replace(/\\/g, "/");
                        if (!normalizedFilePath.startsWith("/")) {
                            normalizedFilePath = "/" + normalizedFilePath;
                        }
                        normalizedFilePath = normalizedFilePath.replace(/\/\//g, "/"); // Replace double slashes with single slash

                        const absoluteFilePath = path.resolve(__dirname, '../../', normalizedFilePath);

                        console.log(`Deleting ${type} file at:`, absoluteFilePath);
                        try {
                            await fs.unlink(absoluteFilePath);
                            console.log(`Deleted ${type} file: ${absoluteFilePath}`);
                        } catch (err: any) {
                            if (err.code === 'ENOENT') {
                                console.warn(`${type.charAt(0).toUpperCase() + type.slice(1)} file not found: ${absoluteFilePath}`);
                            } else {
                                console.error(`Failed to delete ${type} file: ${absoluteFilePath}`, err);
                                throw { status: 500, message: `Failed to delete ${type} file: ${absoluteFilePath}` };
                            }
                        }
                    } else {
                        console.warn(`No ${type} record found with ResourceID: ${resource.ResourceID}`);
                    }
                }
            };

            // Delete image and video resources
            await deleteResources(imageResourcesToDelete, "image");
            await deleteResources(videoResourcesToDelete, "video");

            // Handle Resource Addition
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
            const images = files?.['images'] || [];
            const videos = files?.['videos'] || [];

            console.log("Uploaded images:", images.map(f => f.filename));
            console.log("Uploaded videos:", videos.map(f => f.filename));

            // Function to insert resources
            const insertResources = async (files: Express.Multer.File[], type: string) => {
                for (const file of files) {
                    const resourceExists = existingResources.some(r => r.entityName === file.filename);
                    if (!resourceExists) {
                        const newResource = transactionalEntityManager.create(Resources, {
                            entityName: file.filename,
                            filePath: `resources/${file.filename}`,
                            fileType: file.mimetype,
                            Package: { PackageID: Number(pkgId) },
                        });
                        await transactionalEntityManager.save(Resources, newResource);
                        console.log(`Inserted new ${type} resource:`, newResource.ResourceID, newResource.filePath);
                    } else {
                        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} resource already exists:`, file.filename);
                    }
                }
            };

            // Insert new image and video resources
            await insertResources(images, "image");
            await insertResources(videos, "video");

            console.log("Update transaction completed successfully.");
        });

        // After transaction, fetch updated package with resources and products
        const updatedPackage = await database.getRepository(Packages).findOne({
            where: { PackageID: Number(pkgId) },
            relations: [
                "Resource",
                "SubCategory",
                "SubCategory.Category",
                "PackageProduct",
                "PackageProduct.Product",
            ]
        });

        return res.status(200).json({
            message: "Package updated successfully",
            success: true,
            updatedPackage
        });
    } catch (error: any) {
        console.error("Error in s_updatePackage:", error);
        if (error.status && error.message) {
            return res.status(error.status).json({ message: error.message, success: false });
        }
        return res.status(500).json({ message: "An internal server error occurred", success: false });
    }
};

//----------------------- get 5 random packages  under women category -----------------------
export const s_getRandomPackagesWomen = async (req: Request, res: Response) => {
    try {
        const womenCategory = await Categories.findOne({ where: { Name: 'Womens' } });
        if (!womenCategory) {
            return res.status(404).send({ message: "Category not found" });
        }

        const randomPackages = await Packages.find({
            where: { SubCategory: { Category: { CategoryID: womenCategory.CategoryID } } },
            take: 5,
            order: { PackageID: 'ASC' },
            relations: ['PackageProduct', 'Reviews', 'SubCategory', 'Resource',
            ]
        });
        if (!randomPackages || randomPackages.length === 0) {
            return res.status(404).send({ message: "No packages found" });
        }
        return randomPackages;
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

//----------------------- get 5 random packages  under men category -----------------------
export const s_getRandomPackagesMen = async (req: Request, res: Response) => {
    try {
        const menCategory = await Categories.findOne({ where: { Name: 'Mens' } });
        if (!menCategory) {
            return res.status(404).send({ message: "Category not found" });
        }

        const randomPackages = await Packages.find({
            where: { SubCategory: { Category: { CategoryID: menCategory.CategoryID } } },
            take: 5,
            order: { PackageID: 'ASC' },
            relations: ['PackageProduct', 'Reviews', 'SubCategory', 'Resource',
            ]
        });
        if (!randomPackages || randomPackages.length === 0) {
            return res.status(404).send({ message: "No packages found" });
        }
        return randomPackages;
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}


// ----------------------------get last package--------------------------------
export const s_getLastPackage = async (req: Request, res: Response) => {
    try {
        const lastPackage = await Packages.findOne({ where:{}, order: { PackageID: 'DESC' }, relations: ['PackageProduct', 'Reviews', 'SubCategory', 'Resource', 'Customization', 'Offer'] });
        if (!lastPackage) {
            return res.status(404).send({ message: "No packages found" });
        }
        return lastPackage;
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
}

