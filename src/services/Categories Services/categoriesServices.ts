import { Request, Response, Router } from 'express';
import { Categories } from '../../entities/categories/Categories';
import { SubCategories } from '../../entities/categories/SubCategories';
import { Resources } from '../../entities/Resources';

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


export const s_createCategory = async (req: Request, res: Response) => {
    try {
        const { Name, IsActive } = req.body;

        // Validate the input
        if (!Name || Name.trim() === '') {
            return res.status(400).send({ message: 'Please provide a category name' });
        }

        // Create the category
        const category = Categories.create({
            Name: Name,
            IsActive: IsActive
        });

        // Save the category first to get its ID
        await category.save();

        // If an image file is provided, create a resource and associate it with the category
        if (req.file) {
            const imageResource = Resources.create({
                entityName: req.file.filename,
                fileType: req.file.mimetype,
                filePath: req.file.path,
                Category: category 
            });

            // Save the image resource
            await imageResource.save();

            // Set the category's Image property after saving the resource
            category.Image = imageResource;
        }

        // Save the category again if an image resource was added
        const createdCategory = await category.save();

        if (createdCategory) {
            return res.status(201).json(createdCategory);
        } else {
            return res.status(400).send({ message: 'Category could not be created' });
        }

    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

//----------------------- Update a category by ID-----------------------
export const s_updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.id);
        const { Name, IsActive } = req.body;

        // Find the category by ID
        const category = await Categories.findOne({ where: { CategoryID: categoryId }, relations: ['Image'] });

        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }

        // Update category details if provided
        category.Name = Name || category.Name;
        category.IsActive = IsActive !== undefined ? IsActive : category.IsActive;

        // If an image file is provided
        if (req.file) {
            // If the category already has an image, update it, otherwise create a new one
            let imageResource;
            if (category.Image) {
                // Update existing image resource
                category.Image.entityName = req.file.filename;
                category.Image.fileType = req.file.mimetype;
                category.Image.filePath = req.file.path;
                imageResource = await category.Image.save();
            } else {
                // Create a new image resource and associate it with the category
                imageResource = await Resources.create({
                    entityName: req.file.filename,
                    fileType: req.file.mimetype,
                    filePath: req.file.path,
                    Category: category  // Associate resource with the category
                }).save();

                category.Image = imageResource;
            }
        }

        // Save the updated category
        const updatedCategory = await category.save();

        if (updatedCategory) {
            return res.status(200).json(updatedCategory);
        } else {
            return res.status(400).send({ message: 'Category could not be updated' });
        }

    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};



//----------------------- Delete a category by ID-----------------------
export const s_deleteCategory = async (req: Request, res: Response) => {
    try {

        const categoryId = Number(req.params.categoryId);
        const category = await Categories.findOne({ where: { CategoryID: categoryId } });

        if (category) {
            await Categories.delete({ CategoryID: categoryId });
            return res.status(200).json({ message: 'Category deleted successfully' });
        }
        return res.status(404).send({ message: 'Category not found' });


    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Get all subcategories for a specific category by category ID-----------------------
export const s_getAllSubcategories = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const category = await Categories.findOne({ where: { CategoryID: categoryId }, relations: ['SubCategory','Image'] });

        if (category) {
            return res.status(200).json(category.SubCategory);
        } else {
            return res.status(404).send({ message: 'Category not found' });
        }
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Create a new subcategory under a specific category-----------------------
export const s_createSubcategory = async (req: Request, res: Response) => {
    try {

        const { Name, IsActive } = req.body;

        if (!Name || Name === '') {
            return res.status(400).send({ message: 'Please provide a subcategory name ' });
        }
     
    
        const categoryId = Number(req.params.categoryId);
        const category = await Categories.findOne({ where: { CategoryID: categoryId } });

        if (category) {

            const createdSubcategory = await SubCategories.create({
                Name: Name,
                IsActive: IsActive,
                Category: category
            }
            ).save();
            if (createdSubcategory) {
                return res.status(201).json(createdSubcategory);
            } else {
                return res.status(400).send({ message: 'Subcategory could not be created' });
            }
        } else {
            return res.status(404).send({ message: 'Category not found' });
        }
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Delete a subcategory under a specific category-----------------------
export const s_DeleteSubcategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const subcategoryId = Number(req.params.subcategoryId);

        const category = await Categories.findOne({ where: { CategoryID: categoryId } });
        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: subcategoryId } });

        if (category && subcategory) {
            await SubCategories.delete({ SubCategoryID: subcategoryId });
            return res.status(200).json({ message: 'Subcategory deleted successfully' });
        }
        return res.status(404).send({ message: 'Subcategory not found' });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Disactivate a category-----------------------
export const s_disactivateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);

        const category = await Categories.findOne({ where: { CategoryID: categoryId } });

        if (category) {
            const ExistingSubcategories = await SubCategories.find({ where: { Category: { CategoryID: categoryId } }, relations: ['Category'] });
            if (ExistingSubcategories && ExistingSubcategories.length > 0) {
                ExistingSubcategories.forEach(async (subcategory) => {
                    subcategory.IsActive = false;
                    await subcategory.save();
                });
            }
            category.IsActive = false;
            const updatedCategory = await category.save();
            if (updatedCategory) {
                return res.status(200).json(updatedCategory);
            } else {
                return res.status(400).send({ message: 'Category could not be updated' });
            }
        } else {
            return res.status(404).send({ message: 'Category not found' });
        }

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

export const s_updateSubcategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const subcategoryId = Number(req.params.subcategoryId);
        const { Name, IsActive } = req.body;

        const category = await Categories.findOne({ where: { CategoryID: categoryId } });
        const subcategory = await SubCategories.findOne({ where: { SubCategoryID: subcategoryId } });

        if (category && subcategory) {
            subcategory.Name = Name || subcategory.Name;
            subcategory.IsActive = IsActive || subcategory.IsActive;

            const updatedSubcategory = await subcategory.save();
            if (updatedSubcategory) {
                return res.status(200).json(updatedSubcategory);
            } else {
                return res.status(400).send({ message: 'Subcategory could not be updated' });
            }
        } else {
            return res.status(404).send({ message: 'Subcategory not found' });
        }

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}