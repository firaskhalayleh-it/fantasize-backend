/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create  an order for the authenticated user
 *     tags: [Order Products]
 *     description: Creates a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to order
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to order
 *                 example: 2
 *               OrderedOptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the option
 *                       example: "material"
 *                     type:
 *                       type: string
 *                       description: The type of option (e.g., "dropdown", "checkbox")
 *                       example: "dropdown"
 *                     optionValues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The name of the option value
 *                             example: "Plastic"
 *                           value:
 *                             type: string
 *                             description: The actual value of the option
 *                             example: "Plastic"
 *                           isSelected:
 *                             type: boolean
 *                             description: Indicates if this value is selected
 *                             example: true
 *                           filePath:
 *                             type: string
 *                             description: Optional file path related to the option
 *                             example: "/images/size-Plastic.png"
 *     responses:
 *       200:
 *         description: Successfully created or updated the order
 *       400:
 *         description: Invalid quantity or other request parameters
 *       404:
 *         description: Product or user not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/{orderId}:
 *   put:
 *     summary: Update an existing order's product
 *     tags: [Order Products]
 *     description: Updates the quantity and customization options of a product in the specified order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to update
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: The new quantity of the product
 *                 example: 3
 *               OrderedOptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the option
 *                       example: "Color"
 *                     type:
 *                       type: string
 *                       description: The type of option (e.g., "dropdown", "checkbox")
 *                       example: "dropdown"
 *                     optionValues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The name of the option value
 *                             example: "Red"
 *                           value:
 *                             type: string
 *                             description: The actual value of the option
 *                             example: "red"
 *                           isSelected:
 *                             type: boolean
 *                             description: Indicates if this value is selected
 *                             example: true
 *                           filePath:
 *                             type: string
 *                             description: Optional file path related to the option
 *                             example: "/images/color-red.png"
 *     responses:
 *       200:
 *         description: Successfully updated the order
 *       404:
 *         description: Order or product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/order/{orderId}/{productId}:
 *   delete:
 *     summary: Delete a product from an existing order
 *     tags: [Order Products]
 *     description: Removes a product from the specified order and recalculates the order's total price.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order from which to delete the product
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to delete from the order
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the product from the order
 *       404:
 *         description: Order or product not found
 *       500:
 *         description: Internal server error
 */
