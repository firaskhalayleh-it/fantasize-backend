import { Request, Response } from 'express';
import { Brands } from '../../entities/Brands';

//-----------------------Add a new brand -----------------------
export const s_addNewBrand = async (req:Request , res:Response) =>{
try {
    const {Name} = req.body;
    if(!Name){
        return `please enter the name a brand`
    }
     const addNewBrand = Brands.create({
        Name:Name
     });
     await addNewBrand.save();
     return addNewBrand;
} catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}

} 

//----------------------- Get all brands-----------------------
export const s_getAllBrands = async (req:Request , res:Response) =>{
try {
    const getAllBrands = await Brands.find();
    if(!getAllBrands){
        return `Not found any brand`
    }
    return getAllBrands
} catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}
} 


//----------------------- Update a brand-----------------------
export const s_updateBrand = async (req:Request , res:Response) =>{
try {
    const {Name} = req.body;
    const brandId :any= req.params.brandId;
    if(!Name){
        return `please enter the name a brand`
    }
     const brand =  await Brands.findOne({where: {BrandID :brandId}})
     if(!brand){
        return `sorry its not found brand : ${Name}`
     }
     brand.Name=Name;
      await brand.save();

      return brand;
} catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}
} 


//----------------------- Delete a brand-----------------------
export const s_deleteBrand = async (req:Request , res:Response) =>{
try {

} catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}
} 
