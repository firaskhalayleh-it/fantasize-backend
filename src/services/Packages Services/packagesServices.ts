import { Request, Response } from 'express';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { getRepository } from 'typeorm';
import { uploadFiles } from '../../config/Multer config/multerConfig';
import { Resources } from '../../entities/Resources';

//----------------------- Create a new package-----------------------
export const s_createPackage = async (req: Request, res: Response) => {
    try {
        const { Name, Description, Price, Validity, Quantity, Message, Size, SubCategoryId, productName } = req.body;

        if (!Name || !Description || !Price || !Quantity || !SubCategoryId || !productName) {
            return res.status(400).send({ message: "Please fill all required fields" });
        }

        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        const products = await Promise.all(
            productName.map(async (Pname: string) => {
                const product = await Products.findOne({ where: { Name: Pname } });
                if (!product) {
                    throw new Error(`The product ${Pname} not found`);
                }

                if (product.Quantity < Quantity) {
                    throw new Error(`Insufficient quantity for product ${Pname}`);
                }
                product.Quantity -= Quantity;
                await product.save();

                return product;
            })
        );

        const newPackage = Packages.create({
            Name: Name,
            Description: Description,
            Price: Number(Price),
            Quantity: Number(Quantity),
            SubCategory: subcategory,
            Product: products,
        });

        await newPackage.save();

        if (req.files) {
            const files = await uploadFiles(req);
            const resourcesRepository = (Resources);

            for (const file of files) {
                const resource = new Resources();
                resource.entityType = 'package';
                resource.fileType = file.mimetype.includes('image') ? 'image' : 'video';
                resource.filePath = `/resources/packages/${newPackage.PackageID}/${file.filename}`;
                resource.Package = newPackage;

                await resourcesRepository.save(resource);
            }
        }

        return res.status(201).send({ message: "Package created successfully", package: newPackage });

    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

//----------------------- Get all packages-----------------------
export const s_getAllPackages = async (req: Request, res: Response) => {
    try {
        const getAllPackages = await Packages.find({ relations: ['products', 'Review'] });
        if (!getAllPackages || getAllPackages.length === 0) {
            return `Not Found Packages`;
        }
        return getAllPackages;

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
        const pkg = await Packages.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory', 'products'] });
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
        const packageId: any = req.params.packageId;
        const { Name, Description, Price, Quantity, SubCategoryId, productName } = req.body;

        const packageRepository = getRepository(Packages);
        const packageToUpdate = await packageRepository.findOne({ where: { PackageID: packageId }, relations: ["Product", "SubCategory"] });
        if (!packageToUpdate) {
            return res.status(404).send({ message: "Package not found" });
        }

        // Update package fields if provided
        packageToUpdate.Name = Name || packageToUpdate.Name;
        packageToUpdate.Description = Description || packageToUpdate.Description;
        packageToUpdate.Price = Price ? Number(Price) : packageToUpdate.Price;
        packageToUpdate.Quantity = Quantity ? Number(Quantity) : packageToUpdate.Quantity;

        // Update SubCategory if provided
        if (SubCategoryId) {
            const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
            if (!subcategory) {
                return res.status(400).send({ message: "SubCategory not found" });
            }
            packageToUpdate.SubCategory = subcategory;
        }

        // Update associated products if provided
        if (productName && productName.length > 0) {
            const products = await Promise.all(
                productName.map(async (Pname: string) => {
                    const product = await Products.findOne({ where: { Name: Pname } });
                    if (!product) {
                        throw new Error(`The product ${Pname} not found`);
                    }
                    return product;
                })
            );
            packageToUpdate.Product = products;
        }

        // Handle file uploads (optional update)
        if (req.files) {
            const resourcesRepository = getRepository(Resources);

            // Remove existing resources linked to the package
            const existingResources = await resourcesRepository.find({ where: { Package: packageToUpdate } });
            await resourcesRepository.remove(existingResources);

            // Save new uploaded resources
            const files = await uploadFiles(req);
            for (const file of files) {
                const resource = new Resources();
                resource.entityType = 'package';
                resource.fileType = file.mimetype.includes('image') ? 'image' : 'video';
                resource.filePath = `/resources/packages/${packageToUpdate.PackageID}/${file.filename}`;
                resource.Package = packageToUpdate;

                await resourcesRepository.save(resource);
            }
        }

        const updatedPackage = await packageRepository.save(packageToUpdate);

        return res.status(200).send({ message: "Package updated successfully", package: updatedPackage });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};