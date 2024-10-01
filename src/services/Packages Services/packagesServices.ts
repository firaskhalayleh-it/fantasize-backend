import { Request, Response } from 'express';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';

//----------------------- Create a new package-----------------------
export const s_createPackage = async (req:Request , res:Response) =>{
try{
    const {Name , Description, Price, Validity,Quantity ,Message ,Size ,SubCategoryId ,productName}=req.body
    const subcategory = await SubCategories.findOne({where:{SubCategoryID:SubCategoryId}});
    if(! subcategory){
        return res.status(400).send({ message:"SubCategory not found"});
    }
        const products = await Promise.all(
            productName.map( async (Pname :string) =>{
                const product = await Products.findOne({where : {Name :Pname}});
                if(! product){
                    // return `the product ${Pname} not found`; 
                    throw new Error(`the product ${Pname} not found`);
                }
                return product
            })
        );
        const addPackage = await Packages.create({
            Name:Name,
            Description:Description,
            Price :Price,
            Validity :Validity,
            Quantity :Quantity,
            Message :Message,
            Size :Size,
            SubCategory:SubCategoryId,
            products:products
        }).save();

        return addPackage ;
    
}catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

} 

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

    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 

//----------------------- Update a package-----------------------
export const s_updatePackage = async (req:Request , res:Response) =>{
    try{

    }catch (err: any) {
            console.log(err);
            res.status(500).send({ message: err.message })
        }
} 