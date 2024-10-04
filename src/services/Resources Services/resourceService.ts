// src/services/resourceService.ts
import { Request } from 'express';
import { getRepository } from 'typeorm';
import { uploadFiles } from '../../config/Multer config/multerConfig';
import { Resources } from '../../entities/Resources';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { Users } from '../../entities/users/Users';
import { ProductCustomizations } from '../../entities/products/ProductCustomizations';
import { PackageCustomizations } from '../../entities/packages/PackageCustomizations';

export const saveMultipleResources = async (
    req: Request,
    entityType: 'product' | 'package' | 'user' | 'productCustomization' | 'packageCustomization',
    entityId: any,
    type?: string
) => {
    const files = await uploadFiles(req);

    const resourcesRepository = (Resources);
    const savedResources = [];

    if (entityType === 'productCustomization' || entityType === 'packageCustomization') {
        const imageFiles = files.filter(file => file.mimetype.includes('image'));
        if (imageFiles.length !== files.length) {
            throw new Error("Only image files are allowed for customizations.");
        }

        const customizationRepository = getRepository(entityType === 'productCustomization' ? ProductCustomizations : PackageCustomizations);

        const customization = await customizationRepository.findOne({ where: { ProductCustomizationID: Number(entityId) } });
        if (!customization) throw new Error(`${entityType} not found`);

        const optionsWithImages = {
            ...customization.Options,
            typeOptions: imageFiles.map((file, index) => {
                const baseOption = {
                    option: `option${index + 1}`,
                    value: `${index + 1}`
                };

                // Add image path if type is "image"
                if (type === 'image') {
                    return {
                        ...baseOption,
                        imagePath: `/resources/${entityType}/${entityId}/${file.filename}`
                    };
                }
                return baseOption;
            })
        };

        customization.Options = optionsWithImages;
        await customizationRepository.save(customization);

        return {
            message: "Customization options updated with image paths",
            options: customization.Options
        };
    } else {
        // Handle Products, Packages, and Users
        for (const file of files) {
            const resource = new Resources();
            resource.entityType = entityType;
            resource.fileType = file.mimetype.includes('image') ? 'image' : 'video';
            resource.filePath = `/resources/${entityType}/${entityId}/${file.filename}`;

            if (entityType === 'product') {
                const productRepository = getRepository(Products);
                const product = await productRepository.findOne({ where: { ProductID: entityId } });
                if (!product) throw new Error("Product not found");
                resource.Product = product;
            } else if (entityType === 'package') {
                const packageRepository = getRepository(Packages);
                const pkg = await packageRepository.findOne({ where: { PackageID: entityId } });
                if (!pkg) throw new Error("Package not found");
                resource.Package = pkg;
            } else if (entityType === 'user') {
                const userRepository = getRepository(Users);
                const user = await userRepository.findOne({ where: { UserID: entityId } });
                if (!user) throw new Error("User not found");
                resource.User = user;
            }

            const savedResource = await resourcesRepository.save(resource);
            savedResources.push(savedResource);
        }

        return {
            message: "Files uploaded and paths saved",
            resources: savedResources,
        };
    }
};
