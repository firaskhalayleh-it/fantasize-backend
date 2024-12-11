import { Request, Response } from 'express';
import { Customization } from '../../entities/Customization';
import { Packages } from '../../entities/packages/Packages';
import { Products } from '../../entities/products/Products';

//----------------------- Create Customization -----------------------
export const s_createCustomization = async (req: Request, res: Response) => {
    try {
        type OptionType = {
            name: string;
            type: string;
            optionValues: {
                name: string;
                value: string;
                isSelected: boolean;
                fileName?: string;
            }[];
        };

        // Retrieve the 'options' field from the request body
        let optionStr = req.body.options || req.body.option;

        if (!optionStr) {
            return res.status(400).send({ message: 'Option field is missing.' });
        }

        let options: OptionType[] = [];

        // Parse the input as JSON or validate its type
        if (typeof optionStr === 'string') {
            try {
                options = JSON.parse(optionStr);
            } catch (err) {
                console.error('Invalid JSON in option field:', err);
                return res.status(400).send({ message: 'Invalid JSON in option field.' });
            }
        } else if (Array.isArray(optionStr)) {
            options = optionStr; // Already an array
        } else if (typeof optionStr === 'object') {
            options = [optionStr]; // Wrap single object in an array
        } else {
            return res.status(400).send({ message: 'Option field is invalid.' });
        }

        console.log('Parsed options:', options);

        // Ensure each option has valid structure
        for (const option of options) {
            if (!Array.isArray(option.optionValues)) {
                console.error('optionValues is not an array:', option.optionValues);
                return res.status(400).send({ message: `optionValues is not an array for option: ${option.name}` });
            }
        }

        // Initialize filesArray to an empty array if req.files is undefined or empty
        const filesArray = (req.files as Express.Multer.File[]) || [];

        console.log('filesArray:', filesArray);

        // Create a mapping from field names to files (if any)
        const filesMap = filesArray.reduce((map, file) => {
            map[file.fieldname] = file;
            return map;
        }, {} as { [key: string]: Express.Multer.File });

        console.log('filesMap:', filesMap);

        // Process each option and update file names
        for (const option of options) {
            option.optionValues = option.optionValues.map((optVal) => {
                if (!optVal || typeof optVal.name !== 'string') {
                    console.error('Invalid optionValue detected:', optVal);
                    optVal = { name: '', value: '', isSelected: false, fileName: '' }; // Provide default structure
                }

                const sanitizedFieldName = optVal.name.trim();
                const file = filesMap[sanitizedFieldName];
                if (file) {
                    optVal.fileName = file.filename;
                    console.log(`File found for optVal.name: ${optVal.name}, fileName: ${file.filename}`);
                } else {
                    optVal.fileName = '';
                    console.log(`No file found for optVal.name: ${optVal.name}; setting fileName to empty string.`);
                }
                return optVal;
            });
        }

        // Create new customization(s)
        const createdCustomizations = [];
        for (const option of options) {
            const newCustomization = Customization.create({

                option: option
            });

            await newCustomization.save();
            createdCustomizations.push(newCustomization);
        }

        // Return the newly created customizations
        return res.status(201).send(createdCustomizations);
    } catch (err: any) {
        console.error(err);
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
