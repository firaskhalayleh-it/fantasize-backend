import { Request, Response } from 'express';

//-----------------------Get all categories -----------------------
export const s_getAllCategories = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 

//----------------------- Get category by ID-----------------------
export const s_getCategory = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- Create a new category-----------------------
export const s_createCategory = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- Update a category by ID-----------------------
export const s_updateCategory = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- Delete a category by ID-----------------------
export const s_deleteCategory = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- Get all subcategories for a specific category by category ID-----------------------
export const s_getAllSubcategories = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- Create a new subcategory under a specific category-----------------------
export const s_createSubcategory = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 

//----------------------- Delete a subcategory under a specific category-----------------------
export const s_DeleteSubcategory = async (req:Request , res:Response) =>{
    try{

    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 