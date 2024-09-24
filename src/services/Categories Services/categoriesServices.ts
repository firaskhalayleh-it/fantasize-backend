import { Request, Response, Router } from 'express';
import { Categories } from '../../entities/categories/Categories';

//-----------------------Get all categories -----------------------
export const s_getAllCategories = async (req: Request, res: Response) => {
    try {
        let categories;

        if (req.originalUrl === '/api/categories/subcategories') {
            categories = await Categories.find({ relations: ['SubCategory'] });
        } else if (req.originalUrl === '/api/categories') {
            categories = await Categories.find();
        }

        if (categories && categories.length > 0) {
            return res.status(200).json(categories);
        } else {
            return res.status(404).send({ message: 'No categories found' });
        }
    } catch (err: any) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};


//----------------------- Get category by ID-----------------------
export const s_getCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const category = await Categories.findOne({ where: { CategoryID: categoryId } });

        if (category) {
            return res.status(200).json(category);
        } else {
            return res.status(404).send({ message: 'Category not found' });
        }

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Create a new category-----------------------
export const s_createCategory = async (req: Request, res: Response) => {
    try {

        const { CategoryName, Description } = req.body;
        const Image = req.file;


    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Update a category by ID-----------------------
export const s_updateCategory = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Delete a category by ID-----------------------
export const s_deleteCategory = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Get all subcategories for a specific category by category ID-----------------------
export const s_getAllSubcategories = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Create a new subcategory under a specific category-----------------------
export const s_createSubcategory = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Delete a subcategory under a specific category-----------------------
export const s_DeleteSubcategory = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 