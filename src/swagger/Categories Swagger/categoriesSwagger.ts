
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of all categories
 *     tags: [Categories]
 *     description: This endpoint returns a list of categories available in the system. Each category contains an ID and a name.
 *     responses:
 *       200:
 *         description: A successful response containing a list of categories
 *       500:
 *         description: An unexpected error occurred on the server
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     description: This endpoint allows authorized users to create a new category with an optional image upload. The category name is required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The name of the category
 *                 example: "Electronics"
 *               IsActive:
 *                 type: boolean
 *                 description: Indicates whether the category is active
 *                 example: true
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the category
 *     responses:
 *       201:
 *         description: added successfully
 *       400:
 *         description: Invalid input or failed category creation
 *       500:
 *         description: Server error
 *       security:
 *         - bearerAuth: []
 */

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     description: Update an existing category by its ID. This includes the option to update the category's name, active status, and upload a new image.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique ID of the category to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The new name of the category
 *                 example: "Home Appliances"
 *               IsActive:
 *                 type: boolean
 *                 description: Indicates whether the category is active
 *                 example: true
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image file for the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Bad request, missing or invalid data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *       security:
 *         - bearerAuth: []
 */


/**
 * @swagger
 * /api/categories/{categoryId}/subcategories:
 *   post:
 *     summary: Create a new subcategory under a specific category
 *     tags: [Subcategories]
 *     description: This endpoint allows authorized users to create a new subcategory under an existing category. The subcategory name is required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique ID of the category to which the subcategory belongs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The name of the subcategory
 *                 example: "Smartphones"
 *               IsActive:
 *                 type: boolean
 *                 description: Indicates whether the subcategory is active
 *                 example: true
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *       400:
 *         description: Bad request, missing or invalid data
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 *       security:
 *         - bearerAuth: []
 */


/**
 * @swagger
 * /api/categories/{categoryId}/subcategories/{subcategoryId}:
 *   put:
 *     summary: Update an existing subcategory under a specific category
 *     tags: [Subcategories]
 *     description: Allows authorized users to update an existing subcategory's name and active status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique ID of the category to which the subcategory belongs
 *       - in: path
 *         name: subcategoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique ID of the subcategory to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The updated name of the subcategory
 *                 example: "Laptops"
 *               IsActive:
 *                 type: boolean
 *                 description: Indicates whether the subcategory is active
 *                 example: true
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       400:
 *         description: Bad request, invalid data or subcategory could not be updated
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Server error
 *       security:
 *         - bearerAuth: []
 */

/**
 * @swagger
 * /api/categories/subcategories:
 *   get:
 *     summary: Retrieve all categories along with their subcategories
 *     tags: [Categories]
 *     description: Fetches all categories and their associated subcategories.
 *     responses:
 *       200:
 *         description: List of all categories and their subcategories
 *       404:
 *         description: No categories found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   put:
 *     summary: Deactivate a category and its subcategories
 *     tags: [Categories]
 *     description: Deactivates a specific category and all its related subcategories. Only authorized users (e.g., admins) can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the category to deactivate
 *     responses:
 *       200:
 *         description: The category and its subcategories have been successfully deactivated
 *       400:
 *         description: Failed to deactivate the category or its subcategories
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
