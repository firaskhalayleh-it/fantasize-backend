import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { Resources } from '../../entities/Resources';
import { In } from 'typeorm';

//----------------------- Get all Videos associated with products or packages -----------------------
export const s_getAllVideos = async (req: Request, res: Response) => {
    console.log("s_getAllVideos function has been called"); // Top-level log
    try {
        // Fetch all product and package IDs
        const product = await Products.find();
        const pkg = await Packages.find();

        console.log("Product IDs:", product.map((p) => p.ProductID));
        console.log("Package IDs:", pkg.map((p) => p.PackageID));

        // Get all Resources that have type video/mp4 and are associated with either a product or package
        const videos = await Resources.find({
            where: [
                { fileType: 'video/mp4', Product: In(product.map((p) => p.ProductID)) },
                { fileType: 'video/mp4', Package: In(pkg.map((p) => p.PackageID)) }
            ],
            relations: ['Product', 'Package']
        });

        // Extract paths of the videos
        const videoPaths = videos.map((video) => ({
            videoId: video.ResourceID,
            videoPath: video.entityName,
            productId: video.Product?.ProductID || null,
            packageId: video.Package?.PackageID || null,
        }));

        return res.status(200).json({ message: 'Videos fetched successfully', videoPaths });
    } catch (err: any) {
        console.log("Error in s_getAllVideos:", err);
        return res.status(500).send({ message: err.message });
    }
};
