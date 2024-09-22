import express from "express"
import { c_createCategory, c_createSubcategory, c_deleteCategory, c_DeleteSubcategory, c_getAllCategories, c_getAllSubcategories, c_getCategory, c_updateCategory } from "../../controllers/Categories Controller/CategoriesController";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";
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
categoryRoute.post('/categories', authMiddleware, adminMiddleware, c_createCategory);

/**
 *  @description   Update a category by ID
 *  @route         /categories/:id
 *  @method        PUT
 *  @access        admin
 */
categoryRoute.put('/categories/:id', authMiddleware, adminMiddleware, c_updateCategory);



/**
 *  @description   Create a new subcategory under a specific category
 *  @route         /categories/:categoryId/subcategories
 *  @method        POST
 *  @access        Public
 */
categoryRoute.post('/categories/:categoryId/subcategories', authMiddleware, adminMiddleware, c_createSubcategory);



/**
 *  @description   update a subcategory under a specific category
 *  @route        '/categories/:categoryId/subcategories/:subcategoryId'
 *  @method        put
 *  @access        admin
 */
categoryRoute.put('/categories/:categoryId/subcategories/:subcategoryId', authMiddleware, adminMiddleware, c_DeleteSubcategory);

/**
 *  @description   Get  all categories with subcategories
 *  @route         /categories/subcategories
 *  @method        GET
 *  @access        Public
 */

categoryRoute.get('/categories/subcategories');


/**
 *  @description   Get selected subcategories for home page mobile and web 
 * version with providing first product picture foreach subcategory
 *  @route         /categories/:id
 *  @method        get
 *  @access        public
 */
categoryRoute.get('/categories/selected_subcategories',);


export default categoryRoute;
