// material service

import { Products } from '../../entities/products/Products';
import { Material } from '../../entities/Material';
import { Request, Response } from 'express';
import { MaterialProduct } from '../../entities/products/MaterialProduct';
import { getManager, In } from 'typeorm';
import { Packages } from '../../entities/packages/Packages';
import { MaterialPackage } from '../../entities/packages/MaterialPackage';


export const s_createMaterial = async (req: Request, res: Response) => {
    try {
        const { MaterialName } = req.body;
        if (!MaterialName) {
            return res.status(400).json({ message: 'Material name is required!' });
        }

        const material = Material.create({
            Name: MaterialName,
        });

        await Material.save(material);

        res.status(201).json({ message: 'Material created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error!' });
    }
};


export const s_getMaterials = async (req: Request, res: Response) => {
    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error!' });
    }
}

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
        res.status(500).json({ message: 'Internal server error!' });
    }
}

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

        material.Name = MaterialName;
        await Material.save(material);

        res.status(200).json({ message: 'Material updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error!' });
    }
}


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
        res.status(500).json({ message: 'Internal server error!' });
    }
}

// assign multiple materials to product

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
        // Start a transaction
        await getManager().transaction(async transactionalEntityManager => {
            // Fetch the product
            const product = await transactionalEntityManager.findOne(Products, { where: { ProductID: Number(ProductID) } });

            if (!product) {
                throw { status: 404, message: 'Product not found!' };
            }

            // Initialize total percentage
            let totalPercentage = 0;

            // Prepare MaterialProduct entries
            const materialProductEntries: MaterialProduct[] = [];

            for (const materialItem of Materials) {
                const { name, percentage } = materialItem;

                if (!name || typeof percentage !== 'number') {
                    throw { status: 400, message: 'Each material must have a valid name and percentage!' };
                }

                // Fetch the material by name (assuming name is unique)
                const material = await transactionalEntityManager.findOne(Material, { where: { Name: name } });

                if (!material) {
                    throw { status: 404, message: `Material '${name}' not found!` };
                }

                totalPercentage += percentage;

                const materialProduct = new MaterialProduct();
                materialProduct.Material = material;
                materialProduct.Product = product;
                materialProduct.percentage = percentage;

                materialProductEntries.push(materialProduct);
            }

            // Optional: Validate that totalPercentage equals 100
            if (totalPercentage !== 100) {
                throw { status: 400, message: 'Total percentage of all materials must equal 100!' };
            }

            // Save all MaterialProduct entries
            await transactionalEntityManager.save(MaterialProduct, materialProductEntries);
        });

        res.status(200).json({ message: 'Materials assigned to product successfully!' });
    } catch (error) {
        if (error && error) {
            res.status(400).json({ message: error });
        } else {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error!' });
        }
    }
};




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
        await getManager().transaction(async transactionalEntityManager => {
            // Fetch the product
            const product = await transactionalEntityManager.findOne(Products, { where: { ProductID: Number(ProductID) }, relations: ['MaterialProduct', 'MaterialProduct.Material'] });

            if (!product) {
                throw { status: 404, message: 'Product not found!' };
            }

            // Initialize total percentage
            let totalPercentage = 0;

            // Prepare a map for existing MaterialProduct entries
            const existingMaterialMap: Map<string, MaterialProduct> = new Map();
            product.MaterialProduct.forEach(mp => {
                if (mp.Material && mp.Material.Name) {
                    existingMaterialMap.set(mp.Material.Name, mp);
                }
            });

            // Prepare arrays for updates and additions
            const materialProductUpdates: MaterialProduct[] = [];
            const materialProductAdditions: MaterialProduct[] = [];

            for (const materialItem of Materials) {
                const { name, percentage } = materialItem;

                if (!name || typeof percentage !== 'number') {
                    throw { status: 400, message: 'Each material must have a valid name and percentage!' };
                }

                // Fetch the material by name (assuming name is unique)
                const material = await transactionalEntityManager.findOne(Material, { where: { Name: name } });

                if (!material) {
                    throw { status: 404, message: `Material '${name}' not found!` };
                }

                totalPercentage += percentage;

                if (existingMaterialMap.has(name)) {
                    // Update existing MaterialProduct
                    const existingMP = existingMaterialMap.get(name)!;
                    existingMP.percentage = percentage;
                    materialProductUpdates.push(existingMP);
                } else {
                    // Add new MaterialProduct
                    const newMP = new MaterialProduct();
                    newMP.Material = material;
                    newMP.Product = product;
                    newMP.percentage = percentage;
                    materialProductAdditions.push(newMP);
                }
            }

            // Optional: Validate that totalPercentage equals 100
            if (totalPercentage !== 100) {
                throw { status: 400, message: 'Total percentage of all materials must equal 100!' };
            }

            // Save updates
            if (materialProductUpdates.length > 0) {
                await transactionalEntityManager.save(MaterialProduct, materialProductUpdates);
            }

            // Save additions
            if (materialProductAdditions.length > 0) {
                await transactionalEntityManager.save(MaterialProduct, materialProductAdditions);
            }

            // Optionally, handle removals if some existing materials are not in the update request
            const updatedMaterialNames = Materials.map(m => m.name);
            const materialsToRemove = product.MaterialProduct.filter(mp => mp.Material && !updatedMaterialNames.includes(mp.Material.Name));
            if (materialsToRemove.length > 0) {
                await transactionalEntityManager.remove(MaterialProduct, materialsToRemove);
            }
        });

        res.status(200).json({ message: 'Materials updated for product successfully!' });
    } catch (error) {
        if (error && error) {
            res.status(400).json({ message: error });
        } else {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error!' });
        }
    }
};


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
        await getManager().transaction(async transactionalEntityManager => {
            // Fetch the product with its materials
            const product = await transactionalEntityManager.findOne(Products, {
                where: { ProductID: Number(ProductID) },
                relations: ['MaterialProduct', 'MaterialProduct.Material'],
            });

            if (!product) {
                throw { status: 404, message: 'Product not found!' };
            }

            // Fetch materials to unassign
            const materials = await transactionalEntityManager.find(Material, {
                where: { Name: In(MaterialNames) },
            });

            if (materials.length !== MaterialNames.length) {
                const foundNames = materials.map(m => m.Name);
                const notFound = MaterialNames.filter(name => !foundNames.includes(name));
                throw { status: 404, message: `Materials not found: ${notFound.join(', ')}` };
            }

            // Find MaterialProduct entries to remove
            const materialProductsToRemove = product.MaterialProduct.filter(mp => mp.Material && MaterialNames.includes(mp.Material.Name));

            if (materialProductsToRemove.length === 0) {
                throw { status: 404, message: 'No matching materials assigned to the product!' };
            }

            // Remove the MaterialProduct entries
            await transactionalEntityManager.remove(MaterialProduct, materialProductsToRemove);
        });

        res.status(200).json({ message: 'Materials unassigned from product successfully!' });
    } catch (error) {
        if (error && error) {
            res.status(400).json({ message: error });
        } else {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error!' });
        }
    }
};

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

export const s_getProductsForMaterial = async (req: Request, res: Response) => {
    const { MaterialID } = req.params;

    if (!MaterialID) {
        return res.status(400).json({ message: 'Material ID is required!' });
    }

    try {
        const material = await Material.findOne({
            where: { MaterialID: Number(MaterialID) },
            relations: ['materialProduct', 'materialProduct.Product'],
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
}

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
        await getManager().transaction(async transactionalEntityManager => {
            // Fetch the package
            const pkg = await transactionalEntityManager.findOne(Packages, { where: { PackageID: Number(PackageID) } });

            if (!pkg) {
                throw { status: 404, message: 'Package not found!' };
            }

            // Initialize total percentage
            let totalPercentage = 0;

            // Prepare MaterialPackage entries
            const materialPackageEntries: MaterialPackage[] = [];

            for (const materialItem of Materials) {
                const { name, percentage } = materialItem;

                if (!name || typeof percentage !== 'number') {
                    throw { status: 400, message: 'Each material must have a valid name and percentage!' };
                }

                // Fetch the material by name (assuming name is unique)
                const material = await transactionalEntityManager.findOne(Material, { where: { Name: name } });

                if (!material) {
                    throw { status: 404, message: `Material '${name}' not found!` };
                }

                totalPercentage += percentage;

                const materialPackage = new MaterialPackage();
                materialPackage.Material = material;
                materialPackage.Package = pkg;
                materialPackage.percentage = percentage;

                materialPackageEntries.push(materialPackage);
            }

            // Optional: Validate that totalPercentage equals 100
            if (totalPercentage !== 100) {
                throw { status: 400, message: 'Total percentage of all materials must equal 100!' };
            }

            // Save all MaterialPackage entries
            await transactionalEntityManager.save(MaterialPackage, materialPackageEntries);
        });

        res.status(200).json({ message: 'Materials assigned to package successfully!' });
    } catch (error) {
        if (error && error) {
            res.status(400).json({ message: error });
        } else {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error!' });
        }
    }
};


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
        await getManager().transaction(async transactionalEntityManager => {
            // Fetch the package with its materials
            const pkg = await transactionalEntityManager.findOne(Packages, {
                where: { PackageID: Number(PackageID) },
                relations: ['MaterialPackage', 'MaterialPackage.Material'],
            });

            if (!pkg) {
                throw { status: 404, message: 'Package not found!' };
            }

            // Initialize total percentage
            let totalPercentage = 0;

            // Prepare a map for existing MaterialPackage entries
            const existingMaterialMap: Map<string, MaterialPackage> = new Map();
            pkg.MaterialPackage.forEach(mp => {
                if (mp.Material && mp.Material.Name) {
                    existingMaterialMap.set(mp.Material.Name, mp);
                }
            });

            // Prepare arrays for updates and additions
            const materialPackageUpdates: MaterialPackage[] = [];
            const materialPackageAdditions: MaterialPackage[] = [];

            for (const materialItem of Materials) {
                const { name, percentage } = materialItem;

                if (!name || typeof percentage !== 'number') {
                    throw { status: 400, message: 'Each material must have a valid name and percentage!' };
                }

                // Fetch the material by name (assuming name is unique)
                const material = await transactionalEntityManager.findOne(Material, { where: { Name: name } });

                if (!material) {
                    throw { status: 404, message: `Material '${name}' not found!` };
                }

                totalPercentage += percentage;

                if (existingMaterialMap.has(name)) {
                    // Update existing MaterialPackage
                    const existingMP = existingMaterialMap.get(name)!;
                    existingMP.percentage = percentage;
                    materialPackageUpdates.push(existingMP);
                } else {
                    // Add new MaterialPackage
                    const newMP = new MaterialPackage();
                    newMP.Material = material;
                    newMP.Package = pkg;
                    newMP.percentage = percentage;
                    materialPackageAdditions.push(newMP);
                }
            }

            // Optional: Validate that totalPercentage equals 100
            if (totalPercentage !== 100) {
                throw { status: 400, message: 'Total percentage of all materials must equal 100!' };
            }

            // Save updates
            if (materialPackageUpdates.length > 0) {
                await transactionalEntityManager.save(MaterialPackage, materialPackageUpdates);
            }

            // Save additions
            if (materialPackageAdditions.length > 0) {
                await transactionalEntityManager.save(MaterialPackage, materialPackageAdditions);
            }

            // Optionally, handle removals if some existing materials are not in the update request
            const updatedMaterialNames = Materials.map(m => m.name);
            const materialsToRemove = pkg.MaterialPackage.filter(mp => mp.Material && !updatedMaterialNames.includes(mp.Material.Name));
            if (materialsToRemove.length > 0) {
                await transactionalEntityManager.remove(MaterialPackage, materialsToRemove);
            }
        });

        res.status(200).json({ message: 'Materials updated for package successfully!' });
    } catch (error) {
        if (error && error) {
            res.status(400).json({ message: error });
        } else {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error!' });
        }
    }
};


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
        await getManager().transaction(async transactionalEntityManager => {
            // Fetch the package with its materials
            const pkg = await transactionalEntityManager.findOne(Packages, {
                where: { PackageID: Number(PackageID) },
                relations: ['MaterialPackage', 'MaterialPackage.Material'],
            });

            if (!pkg) {
                throw { status: 404, message: 'Package not found!' };
            }

            // Fetch materials to unassign
            const materials = await transactionalEntityManager.find(Material, {
                where: { Name: In(MaterialNames) }, // Assuming 'Name' is unique
            });

            if (materials.length !== MaterialNames.length) {
                const foundNames = materials.map(m => m.Name);
                const notFound = MaterialNames.filter(name => !foundNames.includes(name));
                throw { status: 404, message: `Materials not found: ${notFound.join(', ')}` };
            }

            // Find MaterialPackage entries to remove
            const materialProductsToRemove = pkg.MaterialPackage.filter(mp => mp.Material && MaterialNames.includes(mp.Material.Name));

            if (materialProductsToRemove.length === 0) {
                throw { status: 404, message: 'No matching materials assigned to the package!' };
            }

            // Remove the MaterialPackage entries
            await transactionalEntityManager.remove(MaterialPackage, materialProductsToRemove);
        });

        res.status(200).json({ message: 'Materials unassigned from package successfully!' });
    } catch (error) {
        if (error && error) {
            res.status(400).json({ message: error });
        } else {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error!' });
        }
    }
};