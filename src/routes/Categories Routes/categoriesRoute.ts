import express from "express"
import { c_createCategory, c_createSubcategory, c_deleteCategory, c_DeleteSubcategory, c_getAllCategories, c_getAllSubcategories, c_getCategory, c_updateCategory } from "../../controllers/Categories Controller/CategoriesController";
const categoryRoute =express.Router();

/**
 *  @description   Get all categories
 *  @route         /categories
 *  @method        GET
 *  @access        Public
 */
categoryRoute.get('/categories',c_getAllCategories);

/** 
 *  @description   Get category by ID
 *  @route         /categories/:id
 *  @method        GET
 *  @access        Public
 */
categoryRoute.get('/categories/:id',c_getCategory);

/**
 *  @description   Create a new category
 *  @route         /categories
 *  @method        POST
 *  @access        Public
 */
categoryRoute.post('/categories',c_createCategory);

/**
 *  @description   Update a category by ID
 *  @route         /categories/:id
 *  @method        PUT
 *  @access        Public
 */
categoryRoute.put('/categories/:id',c_updateCategory);

/**
 *  @description   Delete a category by ID
 *  @route         /categories/:id
 *  @method        DELETE
 *  @access        Public
 */
categoryRoute.delete('/categories/:id',c_deleteCategory);

/**
 *  @description   Create a new subcategory under a specific category
 *  @route         /categories/:categoryId/subcategories
 *  @method        POST
 *  @access        Public
 */
categoryRoute.post('/categories/:categoryId/subcategories',c_createSubcategory);

/**
 *  @description   Get all subcategories for a specific category by category ID
 *  @route         /categories/:categoryId/subcategories
 *  @method        GET
 *  @access        Public
 */
categoryRoute.get('/categories/:categoryId/subcategories',c_getAllSubcategories);


/**
 *  @description Is Active Or Is DisActive
 *  @method        
 *  @access        
 */
// categoryRoute.delete('/categories/:categoryId/subcategories',c_DeleteSubcategory);

export default categoryRoute;
