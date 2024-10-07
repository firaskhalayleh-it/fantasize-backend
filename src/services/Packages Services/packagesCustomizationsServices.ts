import { Request, Response } from 'express';
import { PackageCustomizations } from '../../entities/packages/PackageCustomizations';
import { Packages } from '../../entities/packages/Packages';
// import { uploadFiles } from '../../config/Multer config/multerConfig';

//----------------------- Create a new customization for a package -----------------------
export const s_createCustomizationPackage = async (req: Request, res: Response) => {
    try {
        const { title, type, typeOptions } = req.body;

        if (!title || !type || !typeOptions || !Array.isArray(typeOptions)) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }

        const validTypes = ["text", "button", "radio", "checkbox", "image", "message", "colorOption"];
        if (!validTypes.includes(type)) {
            return res.status(400).send({ message: "Invalid type" });
        }

        let formattedTypeOptions;
        if(type === "image" && req.files) {
            const files = req.files as Express.Multer.File[];
            formattedTypeOptions = files.map((file, index) => ({
                option: typeOptions[index]?.option || `Option ${index + 1}`,
                value: typeOptions[index]?.value || `Value ${index + 1}`,
                imagePath: `/resources/${file.filename}` 
            }));
        } else {

        const customizationObj = {
            title: title,
            type: type,
            typeOptions: formattedTypeOptions,
        };
    
        const customization = PackageCustomizations.create({
            Options: customizationObj,
        });
    
        await customization.save();

        return res.status(201).send({ message: "Customization created successfully", customization });
    }
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};



//----------------------- Update a package customization -----------------------
export const s_updateCustomizationPackage = async (req: Request, res: Response) => {
    try {
        const customizationId = Number(req.params.customizationId);
        const { title, type, typeOptions } = req.body;

        if (!title || !type || !typeOptions || !Array.isArray(typeOptions)) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }

        const validTypes = ["text", "button", "radio", "checkbox", "image", "message", "colorOption"];
        if (!validTypes.includes(type)) {
            return res.status(400).send({ message: "Invalid type" });
        }

        const customization = await PackageCustomizations.findOne({ where: { PackageCustomizationID: customizationId } });
        if (!customization) {
            return res.status(404).send({ message: "Customization not found" });
        }

        let formattedTypeOptions;

        if (type === "image" && req.files) {
            const files = req.files as Express.Multer.File[];
            formattedTypeOptions = files.map((file, index) => ({
                option: typeOptions[index]?.option || `Option ${index + 1}`,
                value: typeOptions[index]?.value || `Value ${index + 1}`,
                imagePath: `/resources/${file.filename}`
            }));
        } else {
            formattedTypeOptions = typeOptions;
        }

        customization.Options = {
            title: title,
            type: type,
            typeOptions: formattedTypeOptions,
        };

        await customization.save();

        return res.status(200).send({ message: "Customization updated successfully", customization });

    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

//----------------------- Get all package customizations -----------------------
export const s_getAllCustomizationPackages = async (req: Request, res: Response) => {
    try {
        const allCustomizations = await PackageCustomizations.find();
        if (!allCustomizations || allCustomizations.length === 0) {
            return res.status(404).send({ message: "No customizations found" });
        }
        return res.status(200).send(allCustomizations);

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}
//----------------------- Delete a package customization -----------------------
export const s_deleteCustomizationPackage = async (req: Request, res: Response) => {
    try {
        const customizationId = Number(req.params.customizationId);

        const customization = await PackageCustomizations.findOne({ where: { PackageCustomizationID: customizationId } });
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

//----------------------- Assign a customization to a package -----------------------
export const s_assignCustomizationToPackage = async (req: Request, res: Response) => {
    try {
        const packageId = Number(req.params.packageId);
        const customizationId = Number(req.params.customizationId);

        const packageItem = await Packages.findOne({ where: { PackageID: packageId } });
        if (!packageItem) {
            return res.status(404).send({ message: "Package not found" });
        }

        const customization = await PackageCustomizations.findOne({ where: { PackageCustomizationID: customizationId } ,});
        if (!customization) {
            return res.status(404).send({ message: "Customization not found" });
        }

        
        if (!packageItem.PackageCustomization) {
            packageItem.PackageCustomization = [];
        }
        packageItem.PackageCustomization.push(customization);
        await packageItem.save();

        return res.status(200).send({ message: "Customization added to package successfully" });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}
