// import { Request } from 'express';
// import { uploadFiles } from '../../config/Multer config/multerConfig';
// import { Resources } from '../../entities/Resources';
// import { Products } from '../../entities/products/Products';
// import { Packages } from '../../entities/packages/Packages';
// import { Users } from '../../entities/users/Users';
// import { ProductCustomizations } from '../../entities/products/ProductCustomizations';
// import { PackageCustomizations } from '../../entities/packages/PackageCustomizations';

// export const saveMultipleResources = async (
//     req: Request,
//     entityType: 'product' | 'package' | 'user' | 'productCustomization' | 'packageCustomization',
//     entityId: any,
//     type?: string
// ) => {
//     const files = await uploadFiles(req.files as Express.Multer.File[], entityType, entityId);

//     const savedResources = [];

//     if (entityType === 'productCustomization' || entityType === 'packageCustomization') {
//         const imageFiles = files.filter(file => file.mimetype.includes('image'));
//         if (imageFiles.length !== files.length) {
//             throw new Error("Only image files are allowed for customizations.");
//         }

//         const customization = await (entityType === 'productCustomization'
//             ? ProductCustomizations.findOne({ where: { ProductCustomizationID: Number(entityId) } })
//             : PackageCustomizations.findOne({ where: { PackageCustomizationID: Number(entityId) } })
//         );

//         if (!customization) throw new Error(`${entityType} not found`);

//         const optionsWithImages = {
//             ...customization.Options,
//             typeOptions: imageFiles.map((file, index) => {
//                 const baseOption = {
//                     option: `option${index + 1}`,
//                     value: `${index + 1}`
//                 };

//                 if (type === 'image') {
//                     return {
//                         ...baseOption,
//                         imagePath: `/resources/${entityType}/${entityId}/${file.filename}`
//                     };
//                 }
//                 return baseOption;
//             })
//         };

//         customization.Options = optionsWithImages;
//         await customization.save();

//         return {
//             message: "Customization options updated with image paths",
//             options: customization.Options
//         };
//     } else {
//         // Handle Products, Packages, and Users
//         for (const file of files) {
//             const resource = new Resources();
//             resource.entityType = entityType;
//             resource.fileType = file.mimetype.includes('image') ? 'image' : 'video';
//             resource.filePath = `/resources/${entityType}/${entityId}/${file.filename}`;

//             if (entityType === 'product') {
//                 const product = await Products.findOne({ where: { ProductID: entityId } });
//                 if (!product) throw new Error("Product not found");
//                 resource.Product = product;
//             } else if (entityType === 'package') {
//                 const pkg = await Packages.findOne({ where: { PackageID: entityId } });
//                 if (!pkg) throw new Error("Package not found");
//                 resource.Package = pkg;
//             } else if (entityType === 'user') {
//                 const user = await Users.findOne({ where: { UserID: entityId } });
//                 if (!user) throw new Error("User not found");
//                 resource.User = user;
//             }

//             const savedResource = await Resources.save(resource);
//             savedResources.push(savedResource);
//         }

//         return {
//             message: "Files uploaded and paths saved",
//             resources: savedResources,
//         };
//     }
// };
