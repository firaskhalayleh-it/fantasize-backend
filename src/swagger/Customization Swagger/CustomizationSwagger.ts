/**
 * @swagger
 * /api/customization:
 *   post:
 *     summary: Create a new customization
 *     tags: [Customization]
 *     description: Creates a new customization with options and optional image file uploads. Requires authentication and authorization.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       description: Type of the option (e.g., image, text, etc.)
 *                       example: image
 *                     optionValues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: string
 *                             description: The value of the option.
 *                             example: "red"
 *                           isSelected:
 *                             type: boolean
 *                             description: Whether the option value is selected.
 *                             example: true
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload, if the option type is 'image'.
 *     responses:
 *       201:
 *         description: Customization created successfully
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/customization:
 *   get:
 *     summary: Get all customizations
 *     tags: [Customization]
 *     description: Retrieves a list of all customizations, including related products and packagess
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customizations retrieved successfully
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/customization:
 *   put:
 *     summary: Update a customization
 *     tags: [Customization]
 *     description: Updates an existing customization based on the provided customizationId and options
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               customizationId:
 *                 type: integer
 *                 example: 123
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: image
 *                     optionValues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: string
 *                             example: "red"
 *                           isSelected:
 *                             type: boolean
 *                             example: true
 *                           filePath:
 *                             type: string
 *                             example: "/uploads/red-image.png"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Customization updated successfully
 *       404:
 *         description: Customization not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customization/product:
 *   post:
 *     summary: Assign customization to multiple products
 *     tags: [Customization]
 *     description: Assigns a customization to multiple products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customizationId:
 *                 type: integer
 *                 example: 123
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Customization successfully assigned to products
 *       400:
 *         description: Invalid input provided (missing customization ID or product IDs)
 *       404:
 *         description: Customization or products not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customization/package:
 *   post:
 *     summary: Assign customization to multiple packages
 *     tags: [Customization]
 *     description: Assigns a customization to multiple packages.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customizationId:
 *                 type: integer
 *                 example: 123
 *               packageIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Customization successfully assigned to packages
 *       400:
 *         description: Invalid input provided (missing customization ID or package IDs)
 *       404:
 *         description: Customization or packages not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/customization/product:
 *   delete:
 *     summary: Remove customization from multiple products
 *     tags: [Customization]
 *     description: Removes a customization from multiple products.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customizationId:
 *                 type: integer
 *                 example: 123
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Customization successfully removed from products
 *       400:
 *         description: Invalid input provided (missing customization ID or product IDs)
 *       404:
 *         description: Customization or products not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/customization/package:
 *   delete:
 *     summary: Remove customization from multiple packages
 *     tags: [Customization]
 *     description: Removes a customization from multiple packages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customizationId:
 *                 type: integer
 *                 example: 123
 *               packageIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Customization successfully removed from packages
 *       400:
 *         description: Invalid input provided (missing customization ID or package IDs)
 *       404:
 *         description: Customization or packages not found
 *       500:
 *         description: Internal server error
 */
