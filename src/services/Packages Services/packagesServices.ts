import { Request, Response } from 'express';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { In } from 'typeorm';

//----------------------- Create a new package-----------------------
export const s_createPackage = async (req: Request, res: Response) => {
    try {
        const { Name, Description, Price, Quantity, Message, Size, SubCategoryId, products } = req.body;

        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        const productName = products.map((pN: { productName: string }) => pN.productName);
        const quantity = products.map((q: { quantity: number }) => q.quantity);

        const pNameIsExist = await Products.find({ where: { Name: In(productName) } });
        if (pNameIsExist.length !== productName.length) {
            return res.status(400).send({ message: "Sorry, some products do not exist" });
        }

        for (let i = 0; i < pNameIsExist.length; i++) {
            const productInDB = pNameIsExist[i];
            const requestedQuantity = quantity[i];

            if (productInDB.Quantity < requestedQuantity) {
                return res.status(400).send({ message: `Insufficient quantity for ${productInDB.Name}` });
            }

            productInDB.Quantity -= requestedQuantity;
            await productInDB.save();
        }

        const addPackage = await Packages.create({
            Name: Name,
            Description: Description,
            Price: Price,
            Quantity: Quantity,
            Size: Size,
            SubCategory: subcategory,
            Product: products
        });

        await addPackage.save();

        return `Added successfully`;

    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};


//----------------------- Get all packages-----------------------
export const s_getAllPackages = async (req:Request , res:Response) =>{
    try{
        const getAllPackages = await Packages.find({relations:['products' ,'Review']});
        if(!getAllPackages || getAllPackages.length===0){
            return `Not Found Packages` ;
        }
        return getAllPackages;

    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//-----------------------Get all packages under a specific subcategory-----------------------
export const s_getAllPackagesUnderSpecificSubcategory = async (req:Request , res:Response) =>{
    try{
        const CategoryID: any = req.params.categoryId;
        const subCategoryID: any = req.params.subcategoryId;
        if(!CategoryID || !subCategoryID){
            return res.status(400).send({ message: "Please fill all the fields" });
        }
        const pkg = await Packages.find({ where: { SubCategory: { Category: { CategoryID: CategoryID }, SubCategoryID: subCategoryID } }, relations: ['SubCategory' ,'products'] });
        if(!pkg){
            return `the packagies not found`;
        }
        return pkg;
    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//----------------------- Get a package by ID-----------------------
export const s_getPackageByID = async (req:Request , res:Response) =>{
    try{
        const pkgId :any = req.params.packageId;
        const getPackage= await Packages.findOne({where :{PackageID:pkgId}})
        if(!getPackage){
            return `not found a package`
        }
        return getPackage;
    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//----------------------- Update a package-----------------------
export const s_updatePackage = async (req: Request, res: Response) => {
    try {
        const packageId :any = req.params.packageId; 
        const { Name, Description, Price, Quantity, Message, Size, SubCategoryId, productName } = req.body;

        const packageToUpdate = await Packages.findOne({ where: {PackageID : packageId} });
        if (!packageToUpdate) {
            return res.status(404).send({ message: "Package not found" });
        }
        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: SubCategoryId } });
        if (!subcategory) {
            return res.status(400).send({ message: "SubCategory not found" });
        }

        packageToUpdate.Name = Name || packageToUpdate.Name;
        packageToUpdate.Description = Description || packageToUpdate.Description;
        packageToUpdate.Price = Price || packageToUpdate.Price;
        packageToUpdate.Message =Message || packageToUpdate.Message;
        packageToUpdate.Quantity = Quantity || packageToUpdate.Quantity;
        packageToUpdate.Size = Size || packageToUpdate.Size;

        packageToUpdate.SubCategory = SubCategoryId || packageToUpdate.SubCategory;

        const products = await Promise.all(
            productName.map(async (Pname: string) => {
                const product = await Products.findOne({ where: { Name: Pname } });
                if (!product) {
                    throw new Error(`The product ${Pname} not found`);
                }
                return product;
            })
        );
        packageToUpdate.Product = products;
        const updatedPackage = await packageToUpdate.save();

        return updatedPackage;

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}
