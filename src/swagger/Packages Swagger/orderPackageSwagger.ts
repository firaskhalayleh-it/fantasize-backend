/**
 * @swagger
 * /api/orderpackage:
 *   post:
 *     summary: Create or update an order for a package
 *     tags: [Order Packages]
 *     description: Create a new order or update an existing one with a specific package and quantity.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packageId:
 *                 type: string
 *                 example: "1"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               orderedOptions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: ["option1", "option2"]
 *             required:
 *               - packageId
 *               - quantity
 *     responses:
 *       200:
 *         description: Package added to order successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Package or user not found
 *       500:
 *         description: Internal server error

 */


/**
 * @swagger
 * /api/orderpackage/{orderId}/{packageId}:
 *   put:
 *     summary: Update an order package
 *     tags: [Order Packages]
 *     description: Updates the quantity and options of a specific package within an order.
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
 *       - name: packageId
 *         in: path
 *         required: true
 *         description: The ID of the package to update within the order
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *               orderedOptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Size"
 *                     type:
 *                       type: string
 *                       example: "string"
 *                     optionValues:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Large"
 *                           value:
 *                             type: string
 *                             example: "L"
 *                           isSelected:
 *                             type: boolean
 *                             example: true
 *                           filePath:
 *                             type: string
 *                             example: "/path/to/image.png"
 *     responses:
 *       200:
 *         description: Order package updated successfully
 *       404:
 *         description: Order or Order Package not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/orderpackage/{orderId}/{packageId}:
 *   delete:
 *     summary: Delete an order package
 *     tags: [Order Packages]
 *     description: Deletes a specific package from an order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: The ID of the order from which the package will be deleted
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: packageId
 *         in: path
 *         required: true
 *         description: The ID of the package to be deleted from the order
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Order package deleted successfully
 *       404:
 *         description: Order or Order Package not found
 *       500:
 *         description: Internal server error
 */
