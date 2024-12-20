// material service

import { Products } from '../../entities/products/Products';
import { Material } from '../../entities/Material';
import { Request, Response } from 'express';
import { MaterialProduct } from '../../entities/products/MaterialProduct';
import { In } from 'typeorm';
import { Packages } from '../../entities/packages/Packages';
import { MaterialPackage } from '../../entities/packages/MaterialPackage';

// Create Material
export const s_createMaterial = async (req: Request, res: Response) => {
    try {
        const { MaterialName } = req.body;
        if (!MaterialName) {
            return res.status(400).json({ message: 'Material name is required!' });
        }

        // Check if material with the same name already exists
        const existingMaterial = await Material.findOne({ where: { Name: MaterialName } });
        if (existingMaterial) {
            return res.status(409).json({ message: 'Material with this name already exists!' });
        }

        const material = Material.create({
            Name: MaterialName,
        });

        await material.save();

        res.status(201).json({ message: 'Material created successfully!', material });
    } catch (error) {
        console.error('Error creating material:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Get All Materials
export const s_getMaterials = async (req: Request, res: Response) => {
    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Get Material by ID
export const s_getMaterialById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Material ID is required!' });
        }
        const material = await Material.findOne({ where: { MaterialID: Number(id) } });

        if (!material) {
            return res.status(404).json({ message: 'Material not found!' });
        }

        res.status(200).json(material);
    } catch (error) {
        console.error('Error fetching material by ID:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Update Material
export const s_updateMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { MaterialName } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Material ID is required!' });
        }
        if (!MaterialName) {
            return res.status(400).json({ message: 'Material name is required!' });
        }

        const material = await Material.findOne({ where: { MaterialID: Number(id) } });

        if (!material) {
            return res.status(404).json({ message: 'Material not found!' });
        }

        // Check if another material with the new name exists
        const existingMaterial = await Material.findOne({ where: { Name: MaterialName } });
        if (existingMaterial && existingMaterial.MaterialID !== material.MaterialID) {
            return res.status(409).json({ message: 'Another material with this name already exists!' });
        }

        material.Name = MaterialName;
        await material.save();

        res.status(200).json({ message: 'Material updated successfully!', material });
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Delete Material
export const s_deleteMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Material ID is required!' });
        }

        const material = await Material.findOne({ where: { MaterialID: Number(id) } });

        if (!material) {
            return res.status(404).json({ message: 'Material not found!' });
        }

        await Material.delete({ MaterialID: Number(id) });

        res.status(200).json({ message: 'Material deleted successfully!' });
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

export const s_assignMaterialsToProduct = async (req: Request, res: Response) => {
    const { ProductID, Materials } = req.body;

    // Validate request body
    if (!ProductID) {
        return res.status(400).json({ message: 'Product ID is required!' });
    }

    if (!Materials || !Array.isArray(Materials) || Materials.length === 0) {
        return res.status(400).json({ message: 'Materials array is required!' });
    }

    try {
        // Fetch the product
        const product = await Products.findOne({ where: { ProductID: Number(ProductID) } });

        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        // Initialize total percentage
        let totalPercentage = 0;

        for (const materialItem of Materials) {
            const { name, percentage } = materialItem;

            if (!name || typeof percentage !== 'number') {
                return res.status(400).json({ message: 'Each material must have a valid name and percentage!' });
            }

            // Fetch the material by name (assuming name is unique)
            const material = await Material.findOne({ where: { Name: name } });

            if (!material) {
                return res.status(404).json({ message: `Material '${name}' not found!` });
            }

            totalPercentage += percentage;

            // Check if the material is already assigned to the product
            const existingAssignment = await MaterialProduct.findOne({
                where: { Product: { ProductID: Number(ProductID) }, Material: { MaterialID: material.MaterialID } },
            });

            if (existingAssignment) {
                existingAssignment.percentage = percentage;
                await existingAssignment.save();
            } else {
                const materialProduct = MaterialProduct.create({
                    Material: material,
                    Product: product,
                    percentage: percentage,
                });
                await materialProduct.save();
            }
        }

        // Validate that total percentage equals 100
        const totalExistingPercentageResult = await MaterialProduct.find({
            where: { Product: { ProductID: Number(ProductID) } },
            select: ['percentage'],
        });

        const totalExistingPercentage = totalExistingPercentageResult.reduce((sum, mp) => sum + mp.percentage, 0);


        if (totalExistingPercentage !== 100) {
            return res.status(400).json({ message: 'Total percentage of all materials must equal 100!' });
        }

        res.status(200).json({ message: 'Materials assigned to product successfully!' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};
// Update Materials for Product
export const s_updateMaterialsForProduct = async (req: Request, res: Response) => {
    const { ProductID, Materials } = req.body;

    // Validate request body
    if (!ProductID) {
        return res.status(400).json({ message: 'Product ID is required!' });
    }

    if (!Materials || !Array.isArray(Materials) || Materials.length === 0) {
        return res.status(400).json({ message: 'Materials array is required!' });
    }

    try {
        // Fetch the product with its materials
        const product = await Products.findOne({
            where: { ProductID: Number(ProductID) },
            relations: ['MaterialProduct', 'MaterialProduct.Material'],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        // Initialize total percentage
        let totalPercentage = 0;

        // Map existing materials
        const existingMaterialsMap: Map<string, MaterialProduct> = new Map();
        product.MaterialProduct.forEach(mp => {
            if (mp.Material && mp.Material.Name) {
                existingMaterialsMap.set(mp.Material.Name, mp);
            }
        });

        // Process incoming materials
        for (const materialItem of Materials) {
            const { name, percentage } = materialItem;

            if (!name || typeof percentage !== 'number') {
                return res.status(400).json({ message: 'Each material must have a valid name and percentage!' });
            }

            // Fetch the material by name
            const material = await Material.findOne({ where: { Name: name } });

            if (!material) {
                return res.status(404).json({ message: `Material '${name}' not found!` });
            }

            totalPercentage += percentage;

            if (existingMaterialsMap.has(name)) {
                // Update existing percentage
                const existingAssignment = existingMaterialsMap.get(name)!;
                existingAssignment.percentage = percentage;
                await existingAssignment.save();
                existingMaterialsMap.delete(name);
            } else {
                // Assign new material
                const materialProduct = MaterialProduct.create({
                    Material: material,
                    Product: product,
                    percentage: percentage,
                });
                await materialProduct.save();
            }
        }

       

        // Validate that total percentage equals 100
       const totalExistingPercentageResult = await MaterialProduct.find({
            where: { Product: { ProductID: Number(ProductID) } },
            select: ['percentage'],
        });

        const totalExistingPercentage = totalExistingPercentageResult.reduce((sum, mp) => sum + mp.percentage, 0);

        if (totalExistingPercentage !== 100) {
            return res.status(400).json({ message: 'Total percentage of all materials must equal 100!' });
        }

        res.status(200).json({ message: 'Materials updated for product successfully!' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Unassign Materials from Product
export const s_unassignMaterialsFromProduct = async (req: Request, res: Response) => {
    const { ProductID, MaterialNames } = req.body;

    // Validate request body
    if (!ProductID) {
        return res.status(400).json({ message: 'Product ID is required!' });
    }

    if (!MaterialNames || !Array.isArray(MaterialNames) || MaterialNames.length === 0) {
        return res.status(400).json({ message: 'MaterialNames array is required!' });
    }

    try {
        // Fetch the product with its materials
        const product = await Products.findOne({
            where: { ProductID: Number(ProductID) },
            relations: ['MaterialProduct', 'MaterialProduct.Material'],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        // Fetch materials to unassign
        const materials = await Material.find({
            where: { Name: In(MaterialNames) },
        });

        if (materials.length !== MaterialNames.length) {
            const foundNames = materials.map(m => m.Name);
            const notFound = MaterialNames.filter(name => !foundNames.includes(name));
            return res.status(404).json({ message: `Materials not found: ${notFound.join(', ')}` });
        }

        // Remove the assignments
        for (const material of materials) {
            const assignment = await MaterialProduct.findOne({
                where: { Product: { ProductID: Number(ProductID) }, Material: { MaterialID: material.MaterialID } },
            });
            if (assignment) {
                await assignment.remove();
            }
        }

        res.status(200).json({ message: 'Materials unassigned from product successfully!' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Get Materials for Product
export const s_getMaterialsForProduct = async (req: Request, res: Response) => {
    const { ProductID } = req.params;

    if (!ProductID) {
        return res.status(400).json({ message: 'Product ID is required!' });
    }

    try {
        const product = await Products.findOne({
            where: { ProductID: Number(ProductID) },
            relations: ['MaterialProduct', 'MaterialProduct.Material'],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        const materials = product.MaterialProduct.map(mp => ({
            name: mp.Material?.Name,
            percentage: mp.percentage,
        }));

        res.status(200).json(materials);
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Products for Material
export const s_getProductsForMaterial = async (req: Request, res: Response) => {
    const { MaterialID } = req.params;

    if (!MaterialID) {
        return res.status(400).json({ message: 'Material ID is required!' });
    }

    try {
        const material = await Material.findOne({
            where: { MaterialID: Number(MaterialID) },
            relations: ['materialProduct', 'materialProduct.Product', 'materialProduct.Product.MaterialProduct'],
        });

        if (!material) {
            return res.status(404).json({ message: 'Material not found!' });
        }

        const products = material.materialProduct.map(mp => ({
            ProductID: mp.Product?.ProductID,
            ProductName: mp.Product?.Name,
            percentage: mp.percentage,
        }));

        res.status(200).json(products);
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Assign Materials to Package
export const s_assignMaterialsToPackage = async (req: Request, res: Response) => {
    const { PackageID, Materials } = req.body;

    // Validate request body
    if (!PackageID) {
        return res.status(400).json({ message: 'Package ID is required!' });
    }

    if (!Materials || !Array.isArray(Materials) || Materials.length === 0) {
        return res.status(400).json({ message: 'Materials array is required!' });
    }

    try {
        // Fetch the package
        const pkg = await Packages.findOne({ where: { PackageID: Number(PackageID) } });

        if (!pkg) {
            return res.status(404).json({ message: 'Package not found!' });
        }

        // Initialize total percentage
        let totalPercentage = 0;

        for (const materialItem of Materials) {
            const { name, percentage } = materialItem;

            if (!name || typeof percentage !== 'number') {
                return res.status(400).json({ message: 'Each material must have a valid name and percentage!' });
            }

            // Fetch the material by name (assuming name is unique)
            const material = await Material.findOne({ where: { Name: name } });

            if (!material) {
                return res.status(404).json({ message: `Material '${name}' not found!` });
            }

            totalPercentage += percentage;

            // Check if the material is already assigned to the package
            const existingAssignment = await MaterialPackage.findOne({
                where: { Package: { PackageID: Number(PackageID) }, Material: { MaterialID: material.MaterialID } },
            });

            if (existingAssignment) {
                existingAssignment.percentage = percentage;
                await existingAssignment.save();
            } else {
                const materialPackage = MaterialPackage.create({
                    Material: material,
                    Package: pkg,
                    percentage: percentage,
                });
                await materialPackage.save();
            }
        }

        // Validate that total percentage equals 100
       const totalExistingPercentageResult = await MaterialPackage.find({
            where: { Package: { PackageID: Number(PackageID) } },
            select: ['percentage'],
        });
        
        const totalExistingPercentage = totalExistingPercentageResult.reduce((sum, mp) => sum + mp.percentage, 0);

        if (totalExistingPercentage !== 100) {
            return res.status(400).json({ message: 'Total percentage of all materials must equal 100!' });
        }

        res.status(200).json({ message: 'Materials assigned to package successfully!' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Update Materials for Package
export const s_updateMaterialsForPackage = async (req: Request, res: Response) => {
    const { PackageID, Materials } = req.body;

    // Validate request body
    if (!PackageID) {
        return res.status(400).json({ message: 'Package ID is required!' });
    }

    if (!Materials || !Array.isArray(Materials) || Materials.length === 0) {
        return res.status(400).json({ message: 'Materials array is required!' });
    }

    try {
        // Fetch the package with its materials
        const pkg = await Packages.findOne({
            where: { PackageID: Number(PackageID) },
            relations: ['MaterialPackage', 'MaterialPackage.Material'],
        });

        if (!pkg) {
            return res.status(404).json({ message: 'Package not found!' });
        }

        // Initialize total percentage
        let totalPercentage = 0;

        // Map existing materials
        const existingMaterialsMap: Map<string, MaterialPackage> = new Map();
        pkg.MaterialPackage.forEach(mp => {
            if (mp.Material && mp.Material.Name) {
                existingMaterialsMap.set(mp.Material.Name, mp);
            }
        });

        // Process incoming materials
        for (const materialItem of Materials) {
            const { name, percentage } = materialItem;

            if (!name || typeof percentage !== 'number') {
                return res.status(400).json({ message: 'Each material must have a valid name and percentage!' });
            }

            // Fetch the material by name
            const material = await Material.findOne({ where: { Name: name } });

            if (!material) {
                return res.status(404).json({ message: `Material '${name}' not found!` });
            }

            totalPercentage += percentage;

            if (existingMaterialsMap.has(name)) {
                // Update existing percentage
                const existingAssignment = existingMaterialsMap.get(name)!;
                existingAssignment.percentage = percentage;
                await existingAssignment.save();
                existingMaterialsMap.delete(name);
            } else {
                // Assign new material
                const materialPackage = MaterialPackage.create({
                    Material: material,
                    Package: pkg,
                    percentage: percentage,
                });
                await materialPackage.save();
            }
        }

        // Remove materials not in the update request
        for (const [name, assignment] of existingMaterialsMap) {
            await assignment.remove();
        }

        // Validate that total percentage equals 100
       const totalExistingPercentageResult = await MaterialPackage.find({
            where: { Package: { PackageID: Number(PackageID) } },
            select: ['percentage'],
        });

        const totalExistingPercentage = totalExistingPercentageResult.reduce((sum, mp) => sum + mp.percentage, 0);

        if (totalExistingPercentage !== 100) {
            return res.status(400).json({ message: 'Total percentage of all materials must equal 100!' });
        }

        res.status(200).json({ message: 'Materials updated for package successfully!' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Unassign Materials from Package
export const s_unassignMaterialsFromPackage = async (req: Request, res: Response) => {
    const { PackageID, MaterialNames } = req.body;

    // Validate request body
    if (!PackageID) {
        return res.status(400).json({ message: 'Package ID is required!' });
    }

    if (!MaterialNames || !Array.isArray(MaterialNames) || MaterialNames.length === 0) {
        return res.status(400).json({ message: 'MaterialNames array is required!' });
    }

    try {
        // Fetch the package with its materials
        const pkg = await Packages.findOne({
            where: { PackageID: Number(PackageID) },
            relations: ['MaterialPackage', 'MaterialPackage.Material'],
        });

        if (!pkg) {
            return res.status(404).json({ message: 'Package not found!' });
        }

        // Fetch materials to unassign
        const materials = await Material.find({
            where: { Name: In(MaterialNames) },
        });

        if (materials.length !== MaterialNames.length) {
            const foundNames = materials.map(m => m.Name);
            const notFound = MaterialNames.filter(name => !foundNames.includes(name));
            return res.status(404).json({ message: `Materials not found: ${notFound.join(', ')}` });
        }

        // Remove the assignments
        for (const material of materials) {
            const assignment = await MaterialPackage.findOne({
                where: { Package: { PackageID: Number(PackageID) }, Material: { MaterialID: material.MaterialID } },
            });
            if (assignment) {
                await assignment.remove();
            }
        }

        res.status(200).json({ message: 'Materials unassigned from package successfully!' });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
};

// Get Materials for Package
export const s_getMaterialsForPackage = async (req: Request, res: Response) => {
    const { PackageID } = req.params;

    if (!PackageID) {
        return res.status(400).json({ message: 'Package ID is required!' });
    }

    try {
        const pkg = await Packages.findOne({
            where: { PackageID: Number(PackageID) },
            relations: ['MaterialPackage', 'MaterialPackage.Material'],
        });

        if (!pkg) {
            return res.status(404).json({ message: 'Package not found!' });
        }

        const materials = pkg.MaterialPackage.map(mp => ({
            name: mp.Material?.Name,
            percentage: mp.percentage,
        }));

        res.status(200).json(materials);
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
