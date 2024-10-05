import { Request, Response } from 'express';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { In, Not } from 'typeorm';
import { database } from '../../config/database';
import { PackageProduct } from '../../entities/packages/packageProduct';


//----------------------- Create a new package-----------------------
export const s_createPackage = async (req: Request, res: Response) => {
    const queryRunner = database.createQueryRunner();

    try {
        await queryRunner.startTransaction();
        const { Name, Description, Price, Quantity, SubCategoryId, products } = req.body;

        //Check subcategory
        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "SubCategory not found" });
        }

        // Extract product names and quantities
        const productNames = products.map((pN: { productName: string }) => pN.productName);
        const quantities = products.map((q: { quantity: number }) => q.quantity);

        // Check if the required products are available
        const pNameIsExist = await Products.find({ where: { Name: In(productNames) } });
        if (pNameIsExist.length !== productNames.length) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "Sorry, some products do not exist" });
        }

        //Check and update available quantities.
        for (let i = 0; i < pNameIsExist.length; i++) {
            let productInDB = pNameIsExist[i];
            let requestedQuantity = quantities[i] * Quantity;

            // Check availability Quantity
            if (productInDB.Quantity < requestedQuantity) {
                await queryRunner.rollbackTransaction();
                return res.status(400).send({ message: `Insufficient quantity for ${productInDB.Name}` });
            }

            // Update product quantity in stock
            productInDB.Quantity -= requestedQuantity;
            await queryRunner.manager.save(productInDB);
        }

        //Create new package
        const newPackage = Packages.create({
            Name: Name,
            Description: Description,
            Price: Price, // السعر يخص جدول Packages فقط
            Quantity: Quantity,
            SubCategory: subcategory,
        });

        await queryRunner.manager.save(newPackage);

        //Add products with quantity to PackageProduct intermediate table with ProductName column added
        for (let i = 0; i < pNameIsExist.length; i++) {
            const packageProduct = PackageProduct.create({
                Package: newPackage,
                Product: pNameIsExist[i],
                Quantity: quantities[i] * Quantity, //Quantity allocated for each product within the package
                ProductName: pNameIsExist[i].Name,  // Add the product name in the new column ProductName.
            });

            await queryRunner.manager.save(packageProduct);
        }

        await queryRunner.commitTransaction();

        return res.status(201).send({ message: "Package added successfully" });

    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.log(err);
        return res.status(500).send({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};




//----------------------- Get all packages-----------------------
export const s_getAllPackages = async (req:Request , res:Response) =>{
    try{
        const getAllPackages = await Packages.find({relations:['PackageProduct','Review']});
        if(!getAllPackages || getAllPackages.length===0){
            return `Not Found Packages` ;
        }
        return getAllPackages
    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//-----------------------Get all packages under a specific subcategory-----------------------
export const s_getAllPackagesUnderSpecificSubcategory = async (req:Request , res:Response) =>{
    try{
        const CategoryID: any = req.params.categoryId;
        const subCategoryID: any = req.params.subcategoryId;
        if(!CategoryID || !subCategoryID){
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const pkg = await Packages.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory' ,'PackageProduct'] });
        if(!pkg){
            return `the packagies not found`;
        }
        return pkg;
    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//----------------------- Get a package by ID-----------------------
export const s_getPackageByID = async (req:Request , res:Response) =>{
    try{
        const pkgId :any = req.params.packageId;
        const getPackage= await Packages.findOne({where :{PackageID:pkgId}})
        if(!getPackage){
            return `not found a package`
        }
        return getPackage;
    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//----------------------- Update a package-----------------------

export const s_updatePackage = async (req: Request, res: Response) => {
    const queryRunner = database.createQueryRunner();
    const packageId :any= req.params.packageId;
    const packageData = req.body;

    try {
        await queryRunner.startTransaction();

        // Find the existing package
        const existingPackage = await queryRunner.manager.findOne(Packages, packageId);

        if (!existingPackage) {
            throw new Error('Package not found');
        }

        // Update the package details
        await queryRunner.manager.update(
            Packages,
            { PackageID: packageId },
            {
                Name: packageData.Name,
                Description: packageData.Description,
                Price: packageData.Price,
                Status: packageData.Status,
                Offer: packageData.Offer,
                SubCategory: packageData.SubCategory,
            }
        );

        // Handle the PackageProduct updates
        if (packageData.PackageProducts) {
            for (const prod of packageData.PackageProducts) {
                const existingPackageProduct = await queryRunner.manager.findOne(PackageProduct, { where: { PackageProductId: prod.PackageProductId } });

                if (!existingPackageProduct) {
                    throw new Error(`PackageProduct with id ${prod.PackageProductId} not found`);
                }

                // Compare the new quantity with the existing one in the PackageProduct table
                const existingQuantity = existingPackageProduct.Quantity;
                const newQuantity = prod.Quantity;

                if (newQuantity > existingQuantity) {
                    // New quantity is greater: decrease product quantity in Products table
                    const product = await queryRunner.manager.findOne(Products, { where: { ProductID: existingPackageProduct.Product.ProductID } });
                    if (!product) throw new Error(`Product with id ${existingPackageProduct.Product.ProductID} not found`);

                    const difference = newQuantity - existingQuantity;
                    if (product.Quantity < difference) {
                        throw new Error(`Insufficient product quantity for product ${product.Name}`);
                    }

                    await queryRunner.manager.update(Products, { ProductID: product.ProductID }, { Quantity: product.Quantity - difference });
                } else if (newQuantity < existingQuantity) {
                    // New quantity is less: increase product quantity in Products table
                    const product = await queryRunner.manager.findOne(Products, { where: { ProductID: existingPackageProduct.Product.ProductID } });
                    if (!product) throw new Error(`Product with id ${existingPackageProduct.Product.ProductID} not found`);

                    const difference = existingQuantity - newQuantity;
                    await queryRunner.manager.update(Products, { ProductID: product.ProductID }, { Quantity: product.Quantity + difference });
                }

                // Update the quantity in the PackageProduct table
                if (newQuantity !== existingQuantity) {
                    await queryRunner.manager.update(PackageProduct, { PackageProductId: prod.PackageProductId }, { Quantity: newQuantity });
                }
            }
        }

        // Commit the transaction
        await queryRunner.commitTransaction();

        return res.status(200).send({ message: 'Package updated successfully' });
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.log(err);
        return res.status(500).send({ message: err.message });
    } finally {
        await queryRunner.release();
    }
};



