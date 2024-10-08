import express from "express"
import { c_createCategory, c_createSubcategory, c_deleteCategory, c_DeleteSubcategory, c_disActiveCategory, c_getAllCategories, c_getAllSubcategories, c_getCategory, c_updateCategory, c_updateSubcategory } from "../../controllers/Categories Controller/CategoriesController";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";
import { isAuthorized } from "../../middlewares/isAuthentecated";
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
categoryRoute.post('/categories', isAuthorized,uploadSingle, c_createCategory);

/**
 *  @description   Update a category by ID
 *  @route         /categories/:id
 *  @method        PUT
 *  @access        admin
 */
categoryRoute.put('/category/:id', isAuthorized,uploadSingle, c_updateCategory);



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
categoryRoute.put('/categories/:categoryId/subcategories/:subcategoryId', isAuthorized, c_updateSubcategory);

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


export default categoryRoute;
