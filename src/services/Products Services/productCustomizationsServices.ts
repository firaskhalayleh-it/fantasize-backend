import { Request, Response } from 'express';
import { ProductCustomizations } from '../../entities/products/ProductCustomizations';
import { Products } from '../../entities/products/Products';

//----------------------- Create a new customization product-----------------------
export const s_createCustomizationProduct = async (req: Request, res: Response) => {
    try {
        const { title, type, typeOptions } = req.body;
        if (!title || !type || !typeOptions || !Array.isArray(typeOptions)) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const validTypes = ["text", "button", "radio", "checkbox", "image",'message','colorOption'];

        if (!validTypes.includes(type)) {
            return res.status(400).send({ message: "Invalid type" });
        }

        const formattedTypeOptions = typeOptions.map((opt) => ({
            option: opt.option,
            value: opt.value,
        }));

        const customizationObj = {
            title: title,
            type: type,
            typeOptions: formattedTypeOptions,
        };

        const customization = ProductCustomizations.create({
            Options: customizationObj,
        });
        await customization.save();

        return customization;


    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Get all customization products-----------------------
export const s_getAllCustomizationProducts = async (req: Request, res: Response) => {
    try {
        const allCustomizations = await ProductCustomizations.find();
        if (!allCustomizations || allCustomizations.length === 0) {
            return `Not Found Customizations`;
        }
        return allCustomizations;

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Update a customization product-----------------------
export const s_updateCustomizationProduct = async (req: Request, res: Response) => {
    try {
        const customizationId = Number(req.params.customizationId);
        const { title, type, typeOptions } = req.body;
        if (!title || !type || !typeOptions || !Array.isArray(typeOptions)) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const validTypes = ["text", "button", "radio", "checkbox", "image","message","colorOption"];

        if (!validTypes.includes(type)) {
            return res.status(400).send({ message: "Invalid type" });
        }

        const formattedTypeOptions = typeOptions.map((opt) => ({
            option: opt.option,
            value: opt.value,
        }));

        const customizationObj = {
            title: title,
            type: type,
            typeOptions: formattedTypeOptions,
        };

        const customization = await ProductCustomizations.findOne({ where: { ProductCustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: "Customization not found" });
        }

        customization.Options = customizationObj;
        await customization.save();

        return customization;

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }


} 

//----------------------- Delete a customization product-----------------------
export const s_deleteCustomizationProduct = async (req: Request, res: Response) => {
    try {
        const customizationId = Number(req.params.customizationId);

        const customization = await ProductCustomizations.findOne({ where: { ProductCustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: "Customization not found" });
        }

        await customization.remove();
        return res.status(200).send({ message: "Customization deleted successfully" });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Assign a customization product to a product-----------------------
export const s_assignCustomizationToProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const customizationId = Number(req.params.customizationId);

        const product = await Products.findOne({ where: { ProductID: productId } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        const customization = await ProductCustomizations.findOne({ where: { ProductCustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: "Customization not found" });
        }

        if (!product.ProductCustomization) {
            product.ProductCustomization = [];
        }
        product.ProductCustomization.push(customization);
        await product.save();

        return res.status(200).send({ message: "Customization added successfully" });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}