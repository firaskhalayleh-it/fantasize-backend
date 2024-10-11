/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
 *     description: Adds a new package along with associated products, images, and videos.
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
 *                 example: "Premium Package 1"
 *               Description:
 *                 type: string
 *                 example: "This is a premium package"
 *               Price:
 *                 type: number
 *                 format: float
 *                 example: 100
 *               Quantity:
 *                 type: integer
 *                 example: 3
 *               SubCategoryId:
 *                 type: integer
 *                 example: 6
 *               products:
 *                 type: string
 *                 description: "JSON string of product details"
 *                 example: '[{"productName":"Nike Shoes","quantity":1}]'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Images to be associated with the package"
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Videos to be associated with the package"
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Invalid input or insufficient product quantity
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: Retrieve all packages
 *     tags: [Packages]
 *     description: Fetches a list of all packages along with their associated products, reviews, subcategories, resources, and customizations.
 *     responses:
 *       200:
 *         description: A list of packages retrieved successfully
 *       404:
 *         description: No packages found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/{categoryId}/{subcategoryId}/packages:
 *   get:
 *     summary: Get all packages under a specific subcategory
 *     tags: [Packages]
 *     description: Retrieve all packages that belong to a specified category and subcategory.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category.
 *         schema:
 *           type: string
 *           example: "1"
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         description: ID of the subcategory.
 *         schema:
 *           type: string
 *           example: "2"
 *     responses:
 *       200:
 *         description: A list of packages under the specified category and subcategory.
 *       400:
 *         description: Bad Request - Missing categoryId or subcategoryId
 *       404:
 *         description: No packages found for the specified category and subcategory
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/packages/{packageId}:
 *   get:
 *     summary: Get package by ID
 *     tags: [Packages]
 *     description: Retrieve a package using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: ID of the package to retrieve.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Package retrieved successfully
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/packages/{packageId}:
 *   put:
 *     summary: Update package by ID
 *     tags: [Packages]
 *     description: Update the details of a package using its unique identifier.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: ID of the package to update.
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Updated Package Name"
 *               Description:
 *                 type: string
 *                 example: "Updated description of the package."
 *               Price:
 *                 type: number
 *                 format: float
 *                 example: 199.99
 *               Quantity:
 *                 type: integer
 *                 example: 10
 *               SubCategoryId:
 *                 type: integer
 *                 example: 2
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productName:
 *                       type: string
 *                       example: "Product 1"
 *                     quantity:
 *                       type: integer
 *                       example: 5
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       400:
 *         description: Bad request due to missing fields or validation errors
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
