import { Request, Response } from 'express';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { In } from 'typeorm';
import { database } from '../../config/database';

//----------------------- Create a new package-----------------------
export const s_createPackage = async (req: Request, res: Response) => {
    const queryRunner = database.createQueryRunner();

    try {
        await queryRunner.startTransaction();

        const { Name, Description, Price, Quantity, Message, Size, SubCategoryId, products } = req.body;

        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "SubCategory not found" });
        }

        const productName = products.map((pN: { productName: string }) => pN.productName);
        const quantity = products.map((q: { quantity: number }) => q.quantity);

        const pNameIsExist = await Products.find({ where: { Name: In(productName) } });
        if (pNameIsExist.length !== productName.length) {
            await queryRunner.rollbackTransaction();
            return res.status(400).send({ message: "Sorry, some products do not exist" });
        }

        for (let i = 0; i < pNameIsExist.length; i++) {
            const productInDB = pNameIsExist[i];
            const requestedQuantity = quantity[i];

            if (productInDB.Quantity < requestedQuantity) {
                await queryRunner.rollbackTransaction();
                return res.status(400).send({ message: `Insufficient quantity for ${productInDB.Name}` });
            }

            productInDB.Quantity -= requestedQuantity;
            await queryRunner.manager.save(productInDB);

        }

        const addPackage =  Packages.create({
            Name: Name,
            Description: Description,
            Price: Price,
            Quantity: Quantity,
            Size: Size,
            SubCategory: subcategory,
            Product: products
        });

        // await addPackage.save();
        await queryRunner.manager.save(addPackage);
        await queryRunner.commitTransaction();

        return `Added successfully`;

    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.log(err);
        return res.status(500).send({ message: err.message });
    }finally{
        await queryRunner.release();
    }
};


//----------------------- Get all packages-----------------------
export const s_getAllPackages = async (req:Request , res:Response) =>{
    try{
        const getAllPackages = await Packages.find({relations:['products' ,'Review']});
        if(!getAllPackages || getAllPackages.length===0){
            return `Not Found Packages` ;
        }
        return getAllPackages;

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
        const pkg = await Packages.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory' ,'products'] });
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

    try {
        await queryRunner.startTransaction();

        const { packageId, Name, Description, Price, Quantity, Size, SubCategoryId, products } = req.body;

        if (!packageId) {
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ message: "Package ID is required" });
        }

        const existingPackage = await Packages.findOne({ where: { PackageID: packageId } });
        if (!existingPackage) {
            await queryRunner.rollbackTransaction();
            return res.status(404).json({ message: "Package not found" });
        }

        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            await queryRunner.rollbackTransaction();
            return res.status(400).json({ message: "SubCategory not found" });
        }

        if (products && products.length > 0) {
            const productNames = products.map((pN: { productName: string }) => pN.productName);
            const quantities = products.map((q: { quantity: number }) => q.quantity);

            const pNameIsExist = await Products.find({ where: { Name: In(productNames) } });
            if (pNameIsExist.length !== productNames.length) {
                await queryRunner.rollbackTransaction();
                return res.status(400).json({ message: "Sorry, some products do not exist" });
            }

            for (let i = 0; i < pNameIsExist.length; i++) {
                const productInDB = pNameIsExist[i];
                const requestedQuantity = quantities[i];

                if (productInDB.Quantity < requestedQuantity) {
                    await queryRunner.rollbackTransaction();
                    return res.status(400).json({ message: `Insufficient quantity for ${productInDB.Name}` });
                }

                productInDB.Quantity -= requestedQuantity;
                // await productInDB.save();
                await queryRunner.manager.save(productInDB);
            }
        }

        existingPackage.Name = Name || existingPackage.Name;
        existingPackage.Description = Description || existingPackage.Description;
        existingPackage.Price = Price || existingPackage.Price;
        existingPackage.Quantity = Quantity || existingPackage.Quantity;
        existingPackage.Size = Size || existingPackage.Size;
        existingPackage.SubCategory = subcategory;

        // await existingPackage.save();
        await queryRunner.manager.save(existingPackage);
        await queryRunner.commitTransaction();
        return  "Package updated successfully";

    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error("Error updating package:", err);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }finally{
        await queryRunner.release();
    }
};
