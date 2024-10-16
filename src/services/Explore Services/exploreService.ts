import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { Resources } from '../../entities/Resources';
import { In } from 'typeorm';

//----------------------- Get all Videos associated with products or packages -----------------------
export const s_getAllVideos = async (req: Request, res: Response) => {
    try {
        // Fetch all product and package IDs
        const productIds = (await Products.find()).map((product) => product.ProductID);
        const packageIds = (await Packages.find()).map((pkg) => pkg.PackageID);

        // Get all Resources that have type video/mp4 and are associated with either a product or package
        const videos = await Resources.find({
            where: [
                { fileType: 'video/mp4', Product: In(productIds) },
                { fileType: 'video/mp4', Package: In(packageIds) }
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
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};

