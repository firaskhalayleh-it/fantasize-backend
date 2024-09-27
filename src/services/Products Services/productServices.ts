import { Request, Response } from "express";
import { Products } from "../../entities/products/Products";
import { Brands } from "../../entities/Brands";
import { SubCategories } from "../../entities/categories/SubCategories";
import { Offers } from "../../entities/Offers";


// ---------------------> Get all products <---------------------
export const s_getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.find();
        if (!products) {
            return "No Products Found !";
        }
        const AvgReviwes = await products.reduce((acc, product) => {
            return {
                AvgRating: acc.AvgRating + product.Review.reduce((acc, review) => acc + review.Rating, 0) / product.Review.length
            }
        }, { AvgRating: 0 });

        products.forEach((product) => {
            product.AvgRating = AvgReviwes.AvgRating;
        }
        );
        return (products);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

// ---------------------> Get product by id <---------------------
export const s_getProduct = async (req: Request, res: Response) => {
    try {
        const productId: any = req.params.id;
        const product = await Products.findOne({ where: { ProductID: productId } })
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
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory'] });
        if (!products) {
            return "The Product Not Found !";
        }
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
        const products = await Products.find({ where: { SubCategory: { Category: { CategoryID: CategoryID } } }, relations: ['SubCategory'] });
        if (!products) {
            return "The Product Not Found !";
        }
        return products;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


// ---------------------> Create a new product <---------------------
export const s_createProduct = async (req: Request, res: Response) => {
    try {
        const { Name, Price, Description, Image, SubCategoryID, Quantity, BrandName, Material } = req.body;
        if (!Name || !Price || !Description || !Image || !SubCategoryID || !Quantity || !BrandName || !Material) {
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const Brand = await Brands.findOne({ where: { Name: BrandName } });

        if (!Brand) {
            return res.status(400).send({ message: "Brand not found" });
        }

        const SubCategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryID } });
        if (!SubCategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        const product = Products.create({
            Name: String(Name),
            Price: Number(Price),
            Description: Description,
            Resource: [Image],
            Material: Material,
            Quantity: Number(Quantity),
            Brand: Brand,
            SubCategory: SubCategory,
        });
        await product.save();
        return product;
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

}

// ---------------------> Update a product <---------------------


export const s_updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.id);
        const { Name, Price, Description, Image, SubCategoryID, Quantity, BrandName, Material } = req.body;
        
        const product = await Products.findOne({ where: { ProductID: productId } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        if (Name) product.Name = Name;
        if (Price) product.Price = Price;
        if (Description) product.Description = Description;
        if (Image) product.Resource = [Image];  
        if (Material) product.Material = Material;
        if (Quantity) product.Quantity = Quantity;

        if (BrandName) {
            const Brand = await Brands.findOne({ where: { Name: BrandName } });
            if (!Brand) {
                return res.status(404).send({ message: "Brand not found" });
            }
            product.Brand = Brand;
        }

        if (SubCategoryID) {
            const SubCategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryID } });
            if (!SubCategory) {
                return res.status(404).send({ message: "SubCategory not found" });
            }
            product.SubCategory = SubCategory;
        }

        await product.save();

        return res.status(200).send({ message: "Product updated successfully", product });
    }
    catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};
