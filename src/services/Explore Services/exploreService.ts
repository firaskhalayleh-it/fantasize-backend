import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { Resources } from '../../entities/Resources';
import { In } from 'typeorm';

//----------------------- Get all Videos associated with products or packages -----------------------
export const s_getAllVideos = async (_req: Request, res: Response) => {
    console.log("s_getAllVideos function has been called");
    try {
        // Fetch all product and package IDs
        const product = await Products.find();
        const pkg = await Packages.find();

        console.log("Product IDs:", product.map((p) => p.ProductID));
        console.log("Package IDs:", pkg.map((p) => p.PackageID));

        // Get all video resources with proper OR conditions
        const videos = await Resources.find({
            where: [
                {
                    fileType: 'video/mp4',
                    Product: { ProductID: In(product.map((p) => p.ProductID).filter(Boolean)) }
                },
                {
                    fileType: 'video/mp4',
                    Package: { PackageID: In(pkg.map((p) => p.PackageID).filter(Boolean)) }
                }
            ],
            relations: ['Product', 'Package']
        });

        const videoPaths = videos.map((video) => ({
            videoId: video.ResourceID,
            videoPath: video.entityName,
            productId: video.Product?.ProductID || null,
            packageId: video.Package?.PackageID || null,
        }));

        return res.status(200).json({ message: 'Videos fetched successfully', videoPaths });
    } catch (err: any) {
        console.error("Error in s_getAllVideos:", err);

        // Improved error handling with type checking
        if (err instanceof TypeError || err instanceof SyntaxError) {
            return res.status(400).json({
                message: 'Invalid request format',
                error: err.message
            });
        }

        return res.status(500).json({
            message: 'Internal server error occurred while fetching videos',
            error: err.message
        });
    }
};
