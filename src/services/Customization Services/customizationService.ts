import { Request, Response } from 'express';
import { Customization } from '../../entities/Customization';
import { Packages } from '../../entities/packages/Packages';
import { Products } from '../../entities/products/Products';

//----------------------- Create Customization -----------------------
export const s_createCustomization = async (req: Request, res: Response) => {
    try {
        const { options } = req.body; // Extract options from the request
        const file = req.file;

        // Check if options is a string; if so, try to parse it
        let parsedOptions;
        if (typeof options === 'string') {
            try {
                parsedOptions = JSON.parse(options); // Parse the string into an object
            } catch (error) {
                return res.status(400).send({ message: "Invalid options format. Must be a JSON object." });
            }
        } else if (typeof options === 'object' && options !== null) {
            parsedOptions = options; // If it's already an object
        } else {
            return res.status(400).send({ message: "Invalid options format. Must be a JSON object." });
        }

        // Check if the options require file processing
        if (parsedOptions.type === 'image' && file) {
            parsedOptions.optionValues = parsedOptions.optionValues.map((optVal: any) => {
                if (optVal.isSelected) {
                    optVal.filePath = file.path; // Store the file path in the JSONB object
                }
                return optVal;
            });
        }

        // Create the customization object
        const customization = Customization.create({
            option: parsedOptions, // Use parsedOptions directly
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
        const { customizationId, options } = req.body; // Extract customizationId and options from the request
        const file = req.file;

        // Find the customization by ID
        const customization = await Customization.findOne({ where: { CustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: 'Customization not found' });
        }

        // Validate and parse options
        let parsedOptions;
        if (typeof options === 'string') {
            try {
                parsedOptions = JSON.parse(options); // Parse the string into an object
            } catch (error) {
                return res.status(400).send({ message: "Invalid options format. Must be a JSON object." });
            }
        } else if (typeof options === 'object' && options !== null) {
            parsedOptions = options; // If it's already an object
        } else {
            return res.status(400).send({ message: "Invalid options format. Must be a JSON object." });
        }

        // Process options and handle image files if provided
        if (parsedOptions.type === 'image' && file) {
            parsedOptions.optionValues = parsedOptions.optionValues.map((optVal: any) => {
                if (optVal.isSelected) {
                    optVal.filePath = file.path; // Store the file path in the JSONB object
                }
                return optVal;
            });
        }

        customization.option = parsedOptions; // Update the customization options

        await customization.save(); // Save the updated customization
        return res.status(200).send(customization); // Send the updated customization back to the client
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message }); // Handle any server errors
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
