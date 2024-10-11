import { Request, Response } from 'express';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { In, Not } from 'typeorm';
import { database } from '../../config/database';
import { PackageProduct } from '../../entities/packages/packageProduct';

import { getRepository } from 'typeorm';
import { Resources } from '../../entities/Resources'; 


//----------------------- Create a new package-----------------------
export const s_createPackage = async (req: Request, res: Response) => {
    const queryRunner = database.createQueryRunner();

    try {
        await queryRunner.startTransaction();
        const { Name, Description, Price, Quantity, SubCategoryId, products } = req.body;

        // Validate input fields
        if (!Name || !Description || !Price || !Quantity || !SubCategoryId || !Array.isArray(products)) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "Please fill all the required fields" });
        }

        // Check subcategory
        const subcategory = await queryRunner.manager.findOne(SubCategories, { where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "SubCategory not found" });
        }

        // Handle files (images and videos)
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const images = files?.['images'] || [];
        const videos = files?.['videos'] || [];

        // Extract product names and quantities
        const productNames = products.map((p: { productName: string }) => p.productName);
        const quantities = products.map((p: { quantity: number }) => p.quantity);

        // Check if the required products are available
        const productsInDB = await queryRunner.manager.find(Products, { where: { Name: In(productNames) } });
        if (productsInDB.length !== productNames.length) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "Sorry, some products do not exist" });
        }

        // Check and update available quantities
        for (let i = 0; i < productsInDB.length; i++) {
            const productInDB = productsInDB[i];
            const requestedQuantity = quantities[i] * Quantity;
            console.log(productInDB.Quantity, requestedQuantity);

            // Check availability quantity
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
                ProductName: productsInDB[i].Name,  // Add the product name in the new column ProductName.
            });

            await queryRunner.manager.save(packageProduct);
        }

        await queryRunner.commitTransaction();


        return res.status(201).send({ message: "Package added successfully",  });

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
        const getAllPackages = await Packages.find({ relations: ['PackageProduct', 'Reviews',
            'SubCategory', 'Resource', 'PackageCustomization'
        ] });
        if (!getAllPackages || getAllPackages.length === 0) {
            return `Not Found Packages`;
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
        const pkg = await Packages.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory', 'PackageProduct'] });
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
        const getPackage = await Packages.findOne({ where: { PackageID: pkgId } })
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
        const { Name, Description, Price, Quantity, SubCategoryId, products } = req.body;
        const pkgId: any = req.params.packageId;

        // Validate input fields
        if (!Name || !Description || !Price || !Quantity || !SubCategoryId || !Array.isArray(products)) {
            return res.status(400).send({ message: "Please fill all the required fields" });
        }

        // Find the package to update
        const getPackage = await Packages.findOne({ where: { PackageID: pkgId } });
        if (!getPackage) {
            return res.status(404).send({ message: "Package not found" });
        }

        // Check subcategory
        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        // Extract product names and quantities from request
        const productNames = products.map((pN: { productName: string }) => pN.productName);
        const quantities = products.map((q: { quantity: number }) => q.quantity);

        // Check if the required products exist
        const pNameIsExist = await Products.find({ where: { Name: In(productNames) } });
        if (pNameIsExist.length !== productNames.length) {
            return res.status(400).send({ message: "Some products do not exist" });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const images = files?.['images'] || [];
        const videos = files?.['videos'] || [];


        // Fetch existing PackageProduct entries
        const existingPackageProducts = await PackageProduct.find({ where: { Package: { PackageID: pkgId } } });

        // Update product quantities and handle new or removed products
        for (let i = 0; i < pNameIsExist.length; i++) {
            const productInDB = pNameIsExist[i];
            const requestedQuantity = quantities[i] * Quantity;

            // Check if the product is already associated with the package
            const existingPackageProduct = existingPackageProducts.find(pp => pp.Product.ProductID === productInDB.ProductID);

            if (existingPackageProduct) {
                // Adjust the quantity based on the new requested quantity
                const quantityDifference = requestedQuantity - existingPackageProduct.Quantity;

                if (productInDB.Quantity < quantityDifference) {
                    return res.status(400).send({ message: `Insufficient quantity for ${productInDB.Name}` });
                }

                // Update product quantity in stock
                productInDB.Quantity -= quantityDifference;
                await productInDB.save();

                // Update the PackageProduct entry
                existingPackageProduct.Quantity = requestedQuantity;
                await existingPackageProduct.save();
            } else {
                // New product to be associated with the package
                if (productInDB.Quantity < requestedQuantity) {
                    return res.status(400).send({ message: `Insufficient quantity for ${productInDB.Name}` });
                }

                // Update product quantity in stock
                productInDB.Quantity -= requestedQuantity;
                await productInDB.save();

                // Create new PackageProduct entry
                const newPackageProduct = PackageProduct.create({
                    Package: getPackage,
                    Product: productInDB,
                    Quantity: requestedQuantity,
                    ProductName: productInDB.Name,
                });

                
                await newPackageProduct.save();
            }
        }

        // Remove products that are no longer associated with the package
        for (const existingPackageProduct of existingPackageProducts) {
            if (!productNames.includes(existingPackageProduct.ProductName)) {
                // Restore the product quantity in stock
                const productInDB = await Products.findOne({ where: { ProductID: existingPackageProduct.Product.ProductID } });
                if (productInDB) {
                    productInDB.Quantity += existingPackageProduct.Quantity;
                    await productInDB.save();
                }

                // Remove the PackageProduct entry
                await existingPackageProduct.remove();
            }
        }

        // Update the package details
        getPackage.Name = Name;
        getPackage.Description = Description;
        getPackage.Price = Price;
        getPackage.Quantity = Quantity;
        getPackage.SubCategory = subcategory;

        await getPackage.save();

        // Save image resources
        const imageResources = await Promise.all(images.map(async (image) => {
            const resource = Resources.create({
                entityName: image.filename,
                filePath: `/resources/${image.filename}`,
                fileType: image.mimetype,
                Package: getPackage,
            });
            return await resource.save();
        }));

        // Save video resources

        const videoResources = await Promise.all(videos.map(async (video) => {
            const resource = Resources.create({
                entityName: video.filename,
                filePath: `/resources/${video.filename}`,
                fileType: video.mimetype,
                Package: getPackage,
            });
            return await resource.save();
        }));

        return res.status(200).send({ message: "Package updated successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error });
    }
};

