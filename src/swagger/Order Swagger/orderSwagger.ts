/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Create a new order for a user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PaymentMethodID:
 *                 type: integer
 *                 description: The ID of the payment method used for the order
 *               AddressID:
 *                 type: integer
 *                 description: The ID of the address where the order will be delivered
 *               IsGift:
 *                 type: boolean
 *                 description: Indicates if the order is a gift
 *               IsAnonymous:
 *                 type: boolean
 *                 description: Indicates if the order should be processed anonymously
 *               GiftMessage:
 *                 type: string
 *                 description: An optional message for the gift recipient
 *     responses:
 *       200:
 *         description: Order checked out successfully
 *       404:
 *         description: User not found or order not valid
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders for the authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders belonging to the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: Retrieve all orders for admin
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all orders in the system
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Retrieve a single order by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Retrieve the cart for the authenticated user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details including items in the cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
