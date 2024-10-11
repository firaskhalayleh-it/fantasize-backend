/**
 * @swagger
 * /api/AddBrands:
 *   post:
 *     summary: Add a new brand
 *     tags: [Brands]
 *     description: Creates a new brand in the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 description: The name of the brand
 *                 example: "Nike"
 *     responses:
 *       201:
 *         description: Brand successfully created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     description: Retrieves a list of all brands in the system.
 *     responses:
 *       200:
 *         description: A list of brands
 *       404:
 *         description: No brands found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/brands/{brandId}:
 *   put:
 *     summary: Update a brand
 *     tags: [Brands]
 *     description: Updates the name of a specified brand.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         description: The ID of the brand to update
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: body
 *         name: body
 *         required: true
 *         description: The brand information to update
 *         schema:
 *           type: object
 *           properties:
 *             Name:
 *               type: string
 *               description: The new name of the brand
 *               example: "Adidas"
 *     responses:
 *       200:
 *         description: The updated brand
 *       400:
 *         description: Bad request
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/brands/{brandId}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brands]
 *     description: Deletes a specified brand by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         description: The ID of the brand to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
