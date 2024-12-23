import express from 'express';
import { c_createCategory, c_createSubcategory, c_deleteCategory, c_DeleteSubcategory, c_disActiveCategory, c_getAllCategories, c_getAllSubcategories, c_getCategory, c_getNewCollection, c_updateCategory, c_updateSubcategory } from "../../controllers/Categories Controller/CategoriesController";

import { IsAuthenticated, isAuthorized } from "../../middlewares/isAuthentecated";
import { uploadSingle } from "../../middlewares/multerMiddleware";
const categoryRoute = express.Router();

/**
 *  @description   Get all categories
 *  @route         /categories
 *  @method        GET
 *  @access        Public
 */
categoryRoute.get('/categories', c_getAllCategories);


/**
 *  @description   Create a new category
 *  @route         /categories
 *  @method        POST
 *  @access        Admin
 */
categoryRoute.post('/categories', isAuthorized, uploadSingle, c_createCategory);



/**
 *  @description   Get a category by ID
 *  @route         /categories/:id
 *  @method        GET
 *  @access        Public
 */
categoryRoute.get('/category/:categoryId', c_getCategory);
/**
 *  @description   Update a category by ID
 *  @route         /categories/:id
 *  @method        PUT
 *  @access        admin
 */
categoryRoute.put('/category/:id', isAuthorized, uploadSingle, c_updateCategory);



/**
 *  @description   Create a new subcategory under a specific category
 *  @route         /categories/:categoryId/subcategories
 *  @method        POST
 *  @access        Public
 */
categoryRoute.post('/categories/:categoryId/subcategories', isAuthorized, c_createSubcategory);



/**
 *  @description   update a subcategory under a specific category
 *  @route        '/categories/:categoryId/subcategories/:subcategoryId'
 *  @method        put
 *  @access        admin
 */
categoryRoute.put('/categories/:categoryId/subcategories/:subcategoryId',isAuthorized, c_updateSubcategory);

/**
 *  @description   Get  all categories with subcategories
 *  @route         /categories/subcategories
 *  @method        GET
 *  @access        Public
 */

categoryRoute.get('/categories/subcategories', c_getAllCategories);

    

/**
 *  @description   disActive a category by ID if it is active
 *  @route         /categories/:CategoryId
 *  @method        put
 *  @access        admin
 */
categoryRoute.put('/categories/:CategoryId', isAuthorized, c_disActiveCategory);


/**
 *  @description   get a new collection of subcategories for first 3 categories
 *  @route         /categories/newCollection
 *  @method        get
 *  @access        Public
 */
categoryRoute.get('/categories/newCollection', c_getNewCollection);

/**
 *  @description   Delete a category by ID
 *  @route         /categories/:id
 *  @method        DELETE
 *  @access        Admin
 */
categoryRoute.delete('/categories/:id', IsAuthenticated, c_deleteCategory);

/**
 *  @description   Delete a subcategory by ID
 *  @route         /categories/:categoryId/subcategories/:subcategoryId
 *  @method        DELETE
 *  @access        Admin
 */
categoryRoute.delete('/subcategories/:subcategoryId', IsAuthenticated, c_DeleteSubcategory);


export default categoryRoute;
