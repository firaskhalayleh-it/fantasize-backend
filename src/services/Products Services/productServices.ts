import { Request, Response } from "express";
import { Products } from "../../entities/products/Products";
import { Brands } from "../../entities/Brands";
import { SubCategories } from "../../entities/categories/SubCategories";
import { Offers } from "../../entities/Offers";
import { getRepository, In, Like } from "typeorm";
import { Resources } from "../../entities/Resources";
import { Categories } from "../../entities/categories/Categories";
import { MaterialProduct } from "../../entities/products/MaterialProduct";
import { Material } from "../../entities/Material";
// import { } from "../Resources Services/resourceService";
// import { uploadFiles } from "../../config/Multer config/multerConfig";


// ---------------------> Get all products <---------------------
export const s_getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.find({ relations: ['Review', 'Offer', 'Review', 'Review.User', 'Review.User.UserProfilePicture'] });
        if (!products || products.length === 0) {
            return res.status(404).send({ message: "No Products Found!" });
        }

        // Modify products to ensure Offers is not null
        const modifiedProducts = products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        });

        return res.status(200).send(modifiedProducts);
    } catch (err: any) {
        console.error(err);
        return res.status(500).send({ message: "An error occurred while fetching products.", error: err.message });
    }
};


// ---------------------> Get product by id <---------------------
export const s_getProduct = async (req: Request, res: Response) => {
    try {
        const productId: any = req.params.id;
        const product = await Products.findOne({
            where: { ProductID: productId }, relations: ['Review', 'Review.User', 'Review.User.UserProfilePicture', 'Offer',
                'Resource', 'SubCategory', 'SubCategory.Category', 'Brand',
            ]
        });

        if (!product) {
            return "The Product Not Found !";
        }




        return product;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

// ---------------------> Get product by category and sub category<---------------------
export const s_getProductByCategoryAndSubCategory = async (req: Request, res: Response) => {
    try {
        const CategoryID: any = req.params.CategoryID;
        const subCategoryID: any = req.params.subCategoryID;
        if (!CategoryID || !subCategoryID) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory', 'Offer'] });
        if (products.length == 0) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

// ---------------------> Get product by category <---------------------
export const s_getProductByCategoryID = async (req: Request, res: Response) => {
    try {
        const CategoryID: any = req.params.CategoryID;
        const products = await Products.find({
            where: { SubCategory: { Category: { CategoryID: CategoryID } } }, relations: ['SubCategory',
                'Offer'
            ]
        });
        if (!products) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


// ---------------------> Create a new product <---------------------
export const s_createProduct = async (req: Request, res: Response) => {
    try {
        const { Name, Price, Description, SubCategoryID, Quantity, BrandName  } = req.body;

        if (!Name || !Price || !Description || !SubCategoryID || !Quantity || !BrandName ) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const productExisted = await Products.findOne({ where: { Name } });
        if (productExisted) {
            return res.status(409).send({ message: "Product already exists" });
        }

        const brand = await Brands.findOne({ where: { Name: BrandName } });
        if (!brand) {
            return res.status(400).send({ message: "Brand not found" });
        }

        const subCategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryID } });
        if (!subCategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        const images = files?.['images'] ?? [];
        const videos = files?.['videos'] ?? [];

        if (images.length === 0 && videos.length === 0) {
            return res.status(400).send({ message: "Please provide at least one image or video" });
        }

     

      


        let product: Products;
        product = Products.create({
            Name: String(Name),
            Price: Number(Price),
            Description: String(Description),
            Quantity: Number(Quantity),
            Brand: brand,
            SubCategory: subCategory,
        });

        await product.save();

        const resources = Resources;

        const imageResources = await Promise.all(images.map(async (image) => {
            const resource = resources.create({
                entityName: image.filename,
                filePath: image.path,
                fileType: image.mimetype,
                Product: product
            });
            return await resources.save(resource);
        }));

        const videoResources = await Promise.all(videos.map(async (video) => {
            const resource = resources.create({
                entityName: video.filename,
                filePath: video.path,
                fileType: video.mimetype,
                Product: product
            });
            return await resources.save(resource);
        }));

        return res.status(200).send({ message: "Product created successfully" });

    } catch (err: any) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};



// ---------------------> Update a product <---------------------



export const s_updateProduct = async (req: Request, res: Response) => {
    try {
        const productId: any = req.params.productId;
        const { Name, Price, Description, SubCategoryID, Quantity, BrandName} = req.body;
        if (!productId) {
            return res.status(400).send({ message: "Please provide a product ID" });
        }
        const productRepository = (Products);
        const product = await productRepository.findOne({ where: { ProductID: productId }, relations: ["Resource",] });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        if (Name) {
            const existingProduct = await productRepository.findOne({ where: { Name } });
            if (existingProduct && existingProduct.ProductID !== product.ProductID) {
                return res.status(409).send({ message: "Product name already exists" });
            }
            product.Name = Name;
        }



     

        if (Price) product.Price = Number(Price);
        if (Description) product.Description = Description;
        
        if (Quantity) product.Quantity = Number(Quantity);

        if (BrandName) {
            const brand = await Brands.findOne({ where: { Name: BrandName } });
            if (!brand) {
                return res.status(404).send({ message: "Brand not found" });
            }
            product.Brand = brand;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        const images = files?.images || [];
        if (images.length > 0) {
            for (const image of images) {
                const resource = Resources.create({
                    entityName: image.filename,
                    filePath: `resources/${image.filename}`,
                    fileType: image.mimetype,
                    Product: product,
                });
                await resource.save();
            }
        }

        const videos = files?.videos || [];
        if (videos.length > 0) {
            for (const video of videos) {
                const resource = Resources.create({
                    entityName: video.filename,
                    filePath: `resources/${video.filename}`,
                    fileType: video.mimetype,
                    Product: product,
                });
                await resource.save();
            }
        }

        if (SubCategoryID) {
            const subCategory = await SubCategories.findOne({ where: { SubCategoryID } });
            if (!subCategory) {
                return res.status(404).send({ message: "SubCategory not found" });
            }
            product.SubCategory = subCategory;
        }

        await productRepository.save(product);

        return res.status(200).send({ message: "Product updated successfully", success: true });

    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).send({ message: "An error occurred", error: error.message });
    }
};

// ---------------------> Search for a product <---------------------
export const s_singleProduct = async (req: Request, res: Response) => {
    try {
        const productId: any = req.params.id;
        const product = await Products.findOne({ where: { ProductID: productId }, relations: ['Brand', 'SubCategory', 'Review', 'Review.User', 'Review.User.UserProfilePicture', 'Offer'] });

        if (!product) {
            return "The Product Not Found !";
        }

        return product;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
};



// --------------------- get 5 random products under men category ---------------------
export const s_getRandomMenProducts = async (req: Request, res: Response) => {
    try {
        const menCategory = await Categories.findOne({ where: { Name: 'Mens' } });
        if (!menCategory) {
            return res.status(404).send({ message: "no category found" });
        }
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: menCategory.CategoryID } } }, relations: ['SubCategory', 'Offer',] });
        if (!products) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

// --------------------- get 5 random products under women category ---------------------
export const s_getRandomWomenProducts = async (req: Request, res: Response) => {
    try {
        const womenCategory = await Categories.findOne({ where: { Name: 'Womens' } });
        if (!womenCategory) {
            return res.status(404).send({ message: "no category found" });
        }
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: womenCategory.CategoryID } } }, relations: ['SubCategory', 'Offer',] });
        if (!products) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


// ---------------------  delete product ---------------------
export const s_deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        if (!productId) {
            return res.status(400).send({ message: "Please provide a product ID" });
        }
        const productRepository = (Products);
        const product = await productRepository.findOne({ where: { ProductID: productId } });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        await productRepository.delete({ ProductID: productId });

        return "Product deleted successfully";
    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
}


// ---------------------  get product by name ---------------------
export const s_getProductByName = async (req: Request, res: Response) => {
    try {
        const productName = req.params.productName;
        const products = await Products.find({ where: { Name: Like(`%${productName}%`) }, relations: ['SubCategory', 'Offer'] });
        if (!products) {
            return res.status(404).send({ message: "The Product Not Found !" });
        }
        products.map(product => {
            if (!product.Offer) {
                product.Offer = new Offers; // Set Offers to an empty array if it's null
            }
            return product;
        }
        );
        return products;
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

