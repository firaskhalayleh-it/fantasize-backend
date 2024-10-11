/**
 * @swagger
 * /api/{CategoryID}/{subCategoryID}/getAllproducts:
 *   get:
 *     summary: Retrieve all products by category and subcategory
 *     tags: [Products]
 *     description: Fetches all products associated with the specified category and subcategory IDs.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: CategoryID
 *         required: true
 *         description: The ID of the category to filter products
 *         schema:
 *           type: integer
 *           example: 101
 *       - in: path
 *         name: subCategoryID
 *         required: true
 *         description: The ID of the subcategory to filter products
 *         schema:
 *           type: integer
 *           example: 202
 *     responses:
 *       200:
 *         description: Successfully retrieved products for the specified category and subcategory
 *       400:
 *         description: Missing category ID or subcategory ID
 *       404:
 *         description: No products found for the specified category and subcategory
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/getProduct/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     description: Fetches the product associated with the specified product ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *       404:
 *         description: No product found for the specified ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/createProduct:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     description: Allows the user to create a new product with the specified details and associated images or videos.
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
 *                 example: "Product Name"
 *               Price:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *               Description:
 *                 type: string
 *                 example: "Detailed description of the product."
 *               SubCategoryID:
 *                 type: integer
 *                 example: 1
 *               Quantity:
 *                 type: integer
 *                 example: 100
 *               BrandName:
 *                 type: string
 *                 example: "Brand X"
 *               Material:
 *                 type: string
 *                 example: "Plastic"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Successfully created the product
 *       400:
 *         description: Bad request due to missing fields or invalid data
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/product/{productId}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     description: Allows the user to update the details of an existing product.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               Price:
 *                 type: number
 *                 format: float
 *                 example: 89.99
 *               Description:
 *                 type: string
 *                 example: "Updated description of the product."
 *               SubCategoryID:
 *                 type: integer
 *                 example: 1
 *               Quantity:
 *                 type: integer
 *                 example: 50
 *               BrandName:
 *                 type: string
 *                 example: "Brand Y"
 *               Material:
 *                 type: string
 *                 example: "Metal"
 *     responses:
 *       200:
 *         description: Successfully updated the product
 *       400:
 *         description: Bad request due to missing fields or invalid data
 *       404:
 *         description: Product, Brand, or SubCategory not found
 *       409:
 *         description: Conflict due to existing product name
 *       500:
 *         description: Internal server error
 */
