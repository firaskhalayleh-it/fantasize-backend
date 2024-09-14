import { Request,Response } from "express";
import { SubCategories } from "../entities/categories/SubCategories";
import { Categories } from "../entities/categories/Categories";

export const getSubCategories = async (req: Request, res: Response) => {
    try {
        const subCategories = await SubCategories.find();
        if (subCategories.length === 0) {
            return res.status(404).json({ message: 'No subcategories found' });
        }

        const subCategoriesList = subCategories.map(subCategory => {
            return {
                SubCategoryID: subCategory.SubCategoryID,
                SubCategoryName: subCategory.Name,
                CategoryName: subCategory.Category.Name
            };
        });

        if (!subCategoriesList) {
            return res.status(404).json({ message: 'No subcategories found' });
        }
        res.status(200).send(subCategoriesList);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}

export const getCategoriesWithSubCategory = async (req: Request, res: Response) => {
    try {
        const categories = await Categories.find();
        if (categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }

        const categoriesList = categories.map(category => {
            return {
                CategoryID: category.CategoryID,
                CategoryName: category.Name,
                SubCategories: category.SubCategory.map(subCategory => {
                    return {
                        SubCategoryID: subCategory.SubCategoryID,
                        SubCategoryName: subCategory.Name
                    }
                })
            };
        });

        if (!categoriesList) {
            return res.status(404).json({ message: 'No categories found' });
        }
        res.status(200).send(categoriesList);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}


export const addCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const existingCategory = await Categories.findOne({ where: { Name: name } });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = Categories.create({
            Name: name
        });

        await category.save();
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}

export const addSubCategory = async (req: Request, res: Response) => {
    try {
        const { name, categoryID } = req.body;
        if (!name || !categoryID) {
            return res.status(400).json({ message: 'Category name and category ID are required' });
        }

        const category = await Categories.findOne({ where: { CategoryID: categoryID } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const existingSubCategory = await SubCategories.findOne({ where: { Name: name } });
        if (existingSubCategory) {
            return res.status(400).json({ message: 'Subcategory already exists' });
        }

        const subCategory = SubCategories.create({
            Name: name,
            Category: category
        });

        await subCategory.save();
        res.status(201).json({ message: 'Subcategory created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}