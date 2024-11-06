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
  
      // Retrieve the 'option' field from the request body
      let optionStr = req.body.options || req.body.option;
  
      if (!optionStr) {
        return res.status(400).send({ message: 'Option field is missing.' });
      }
  
      let option: OptionType;
  
      // Check if optionStr is a string or an object
      if (typeof optionStr === 'string') {
        // Parse the JSON string
        try {
          option = JSON.parse(optionStr);
        } catch (err) {
          console.error('Invalid JSON in option field:', err);
          return res.status(400).send({ message: 'Invalid JSON in option field.' });
        }
      } else if (typeof optionStr === 'object') {
        // optionStr is already an object
        option = optionStr;
      } else {
        return res.status(400).send({ message: 'Option field is invalid.' });
      }
  
      console.log('Parsed option:', option);
  
      // Check if optionValues is an array
      if (!Array.isArray(option.optionValues)) {
        return res.status(400).send({ message: 'optionValues is not an array.' });
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
  
      // Iterate over the optionValues to set file names for each
      option.optionValues = option.optionValues.map((optVal) => {
        const sanitizedFieldName = optVal.name.trim();
        const file = filesMap[sanitizedFieldName];
        if (file) {
          optVal.fileName = file.filename;
          console.log(`File found for optVal.name: ${optVal.name}, fileName: ${file.filename}`);
        } else {
          // No file provided for this optionValue; set fileName to empty string
          optVal.fileName = '';
          console.log(`No file found for optVal.name: ${optVal.name}; setting fileName to empty string.`);
        }
        return optVal;
      });
  
      // Fetch the existing customization entity from the database
      const customization = await Customization.findOne({ where: { CustomizationID: req.body.CustomizationID } });
      if (!customization) {
        return res.status(404).send({ message: 'Customization not found.' });
      }
  
      // Update the option field with the new data
      customization.option = option;
  
      // Save the updated customization entity
      await customization.save();
  
      // Return the updated customization entity
      return res.status(200).send(customization);
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
