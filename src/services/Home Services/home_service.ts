import express from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Packages } from '../../entities/packages/Packages';
import { In, MoreThanOrEqual } from 'typeorm';
import { OrdersPackages } from '../../entities/packages/OrdersPackages';

//----------------------- get new arrivals -----------------------
export const s_getNewArrivals = async (req: express.Request, res: express.Response) => {
    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        // Fetch products created within the last three days with all resources
        const products = await Products.find({
            where: { CreatedAt: MoreThanOrEqual(threeDaysAgo) },
            relations: ["Resource"],
        });

        // Fetch packages created within the last three days with all resources
        const packages = await Packages.find({
            where: { CreatedAt: MoreThanOrEqual(threeDaysAgo) },
            relations: ["Resource"],
        });

        // Combine products and packages, sort by creation date, and limit to 10 results
        const newArrivals = [...products, ...packages]
            .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
            .slice(0, 10);

        return res.status(200).json(newArrivals);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};


//----------------------- get recommended for you -----------------------


export const s_getRecommendedForYou = async (req: express.Request, res: express.Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        if (!userId) {
            return res.status(400).send({ message: "User ID not found" });
        }
        console.log(`User ID is: ${userId}`);

        const userProductSubcategories = await OrdersProducts.find({
            where: { Order: { User: { UserID: userId } } },
            relations: ["Product", "Product.SubCategory", "Product.Resource"],
        });

        const productSubCategoryIds = userProductSubcategories.map(
            orderProduct => orderProduct.Product.SubCategory.SubCategoryID
        );

        // Step 2: Get SubCategory IDs of packages the user has previously ordered
        const userPackageSubcategories = await OrdersPackages.find({
            where: { Order: { User: { UserID: userId } } },
            relations: ["Package", "Package.SubCategory", "Package.Resource"],
        });

        const packageSubCategoryIds = userPackageSubcategories.map(
            orderPackage => orderPackage.Package.SubCategory.SubCategoryID
        );

        // Combine product and package subcategory IDs and remove duplicates
        const subCategoryIds = Array.from(new Set([...productSubCategoryIds, ...packageSubCategoryIds]));

        // Step 3: Fetch recommended products based on the subcategories, limited to image resources only
        const recommendedProducts = await Products.find({
            where: { SubCategory: { SubCategoryID: In(subCategoryIds) } },
            relations: ["Resource", "SubCategory"],
            take: 10,
        });

        // Step 4: Fetch recommended packages based on the subcategories, limited to image resources only
        const recommendedPackages = await Packages.find({
            where: { SubCategory: { SubCategoryID: In(subCategoryIds) } },
            relations: ["Resource", "SubCategory"],
            take: 10,
        });

        // Filter resources to include only images
        recommendedProducts.forEach(product => {
            product.Resource = product.Resource.filter(resource => resource.fileType.includes("image"));
        });

        recommendedPackages.forEach(pkg => {
            pkg.Resource = pkg.Resource.filter(resource => resource.fileType.includes("image"));
        });

        // Combine recommended products and packages
        const recommendations = [...recommendedProducts, ...recommendedPackages];

        res.status(200).json(recommendations);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};
