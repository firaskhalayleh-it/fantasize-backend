import { Request, Response } from 'express';
import { Customization } from '../../entities/Customization';
import { Packages } from '../../entities/packages/Packages';
import { Products } from '../../entities/products/Products';

//----------------------- Create Customization -----------------------
export const s_createCustomization = async (req: Request, res: Response) => {
    try {
        const { options } = req.body;
        const file = req.file;

        // Process options and handle image files if provided
        const processedOptions = options.map((option: any) => {
            if (option.type === 'image' && file) {
                option.optionValues = option.optionValues.map((optVal: any) => {
                    if (optVal.isSelected) {
                        optVal.filePath = file.path; // Store the file path in the JSONB object
                    }
                    return optVal;
                });
            }
            return option;
        });

        // Create customization entity instance
        const customization = Customization.create({
            option: processedOptions,
        });

        await customization.save();
        return res.status(201).send(customization);
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

//----------------------- Get All Customizations -----------------------
export const s_getAllCustomizations = async (req: Request, res: Response) => {
    try {
        const customizations = await Customization.find({
            relations: ["Product", "Packages"]
        });
        return res.status(200).send(customizations);
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

//----------------------- Update Customization -----------------------
export const s_updateCustomization = async (req: Request, res: Response) => {
    try {
        const { customizationId, options } = req.body;
        const file = req.file;

        const customization = await Customization.findOne({ where: { CustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: 'Customization not found' });
        }

        // Process options and handle image files if provided
        const processedOptions = options.map((option: any) => {
            if (option.type === 'image' && file) {
                option.optionValues = option.optionValues.map((optVal: any) => {
                    if (optVal.isSelected) {
                        optVal.filePath = file.path; // Store the file path in the JSONB object
                    }
                    return optVal;
                });
            }
            return option;
        });

        customization.option = processedOptions;

        await customization.save();
        return res.status(200).send(customization);
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

//----------------------- Assign Customization to Product -----------------------
export const s_assignCustomizationToProduct = async (req: Request, res: Response) => {
    try {
        const { customizationId, productIds } = req.body;

        // Validate that customizationId and productIds are provided
        if (!customizationId) {
            return res.status(400).send({ message: 'Please provide a customization ID' });
        }

        if (!Array.isArray(productIds) || productIds.length === 0) {
            console.log(productIds);
            return res.status(400).send({ message: 'Please provide a valid array of product IDs' });
        }

        const customization = await Customization.findOne({ where: { CustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: 'Customization not found' });
        }

        const products = await Products.findByIds(productIds);
        if (!products.length) {
            return res.status(404).send({ message: 'No products found' });
        }

        customization.Product = products;
        await customization.save();

        return res.status(200).send(customization);
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};


//----------------------- Assign Customization to Package -----------------------
export const s_assignCustomizationToPackage = async (req: Request, res: Response) => {
    try {
        const { customizationId, packageIds } = req.body;

        const customization = await Customization.findOne({ where: { CustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: 'Customization not found' });
        }

        const packages = await Packages.findByIds(packageIds);
        if (!packages.length) {
            return res.status(404).send({ message: 'No packages found' });
        }

        customization.Packages = packages;
        await customization.save();

        return res.status(200).send(customization);
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

//----------------------- Remove Customization from Product -----------------------
export const s_removeCustomizationFromProduct = async (req: Request, res: Response) => {
    try {
        const { customizationId, productIds } = req.body;

        const customization = await Customization.findOne({ where: { CustomizationID: customizationId }, relations: ['Product'] });
        if (!customization) {
            return res.status(404).send({ message: 'Customization not found' });
        }

        customization.Product = customization.Product.filter((product) => !productIds.includes(product.ProductID));
        await customization.save();

        return res.status(200).send({ message: 'Customization removed from products' });
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

//----------------------- Remove Customization from Package -----------------------
export const s_removeCustomizationFromPackage = async (req: Request, res: Response) => {
    try {
        const { customizationId, packageIds } = req.body;

        const customization = await Customization.findOne({ where: { CustomizationID: customizationId }, relations: ['Packages'] });
        if (!customization) {
            return res.status(404).send({ message: 'Customization not found' });
        }

        customization.Packages = customization.Packages.filter((pkg) => !packageIds.includes(pkg.PackageID));
        await customization.save();

        return res.status(200).send({ message: 'Customization removed from packages' });
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};
