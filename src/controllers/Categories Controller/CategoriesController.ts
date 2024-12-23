import { Request, Response } from 'express';
import { s_createCategory, s_createSubcategory, s_deleteCategory, 
    s_DeleteSubcategory,s_getNewCollection, s_disactivateCategory, 
    s_getAllCategories, s_getAllSubcategories, s_getCategory, 
    s_updateCategory, s_updateSubcategory } from '../../services/Categories Services/categoriesServices';

//-----------------------Get all categories -----------------------
export const c_getAllCategories = async (req:Request , res:Response) =>{

    const result = await s_getAllCategories(req, res);
    res.status(200).json(result);

} 

//----------------------- Get category by ID-----------------------
export const c_getCategory = async (req:Request , res:Response) =>{

    const result = await s_getCategory(req, res);
    res.status(200).json(result);
} 


//----------------------- Create a new category-----------------------
export const c_createCategory = async (req:Request , res:Response) =>{

    const result = await s_createCategory(req, res);
    res.status(200).json(result);
} 


//----------------------- Update a category by ID-----------------------
export const c_updateCategory = async (req:Request , res:Response) =>{

    const result = await s_updateCategory(req, res);
    res.status(200).json(result);
} 

//----------------------- Delete a category by ID-----------------------
export const c_deleteCategory = async (req:Request , res:Response) =>{

    const result = await s_deleteCategory(req, res);
    res.status(200).json(result);
} 

//----------------------- Get all subcategories for a specific category by category ID-----------------------
export const c_getAllSubcategories = async (req:Request , res:Response) =>{

    const result = await s_getAllSubcategories(req, res);
    res.status(200).json(result);
} 

//----------------------- Get all subcategories for a specific category by category ID-----------------------
export const c_getNewCollection = async (req:Request , res:Response) =>{

    const result = await s_getNewCollection(req, res);
    res.status(200).json(result);
}

//----------------------- Create a new subcategory under a specific category-----------------------
export const c_createSubcategory = async (req:Request , res:Response) =>{

    const result = await s_createSubcategory(req, res);
    res.status(200).json(result);
} 

//----------------------- Delete a subcategory under a specific category-----------------------
export const c_DeleteSubcategory = async (req:Request , res:Response) =>{

    const result = await s_DeleteSubcategory(req, res);
    res.status(200).json(result);
} 

export const c_disActiveCategory = async (req:Request , res:Response) =>{
    const result = await s_disactivateCategory(req, res);
    res.status(200).json(result);
}

export const c_updateSubcategory = async (req:Request , res:Response) =>{
    const result = await s_updateSubcategory(req, res);
    res.status(200).json(result);
}

