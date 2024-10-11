/**
 * @swagger
 * /api/user/create_payment_method_user:
 *   post:
 *     summary: Create a new payment method for the user
 *     tags: [Payment Methods]
 *     description: Allows an authorized user to create a new payment method for themselves.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CardType:
 *                 type: string
 *                 example: "Visa"
 *               CardNumber:
 *                 type: string
 *                 example: "4111111111111111"
 *               ExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               CVV:
 *                 type: string
 *                 example: "123"
 *               CardholderName:
 *                 type: string
 *                 example: "yahia Firas"
 *               Method:
 *                 type: string
 *                 example: "Credit Card"
 *     responses:
 *       201:
 *         description: Payment method created successfully
 *       400:
 *         description: Bad request, missing or invalid data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/user/update_payment_method_user:
 *   put:
 *     summary: Update a payment method for the user
 *     tags: [Payment Methods]
 *     description: Allows an authorized user to update their payment method details.
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
 *                 example: 1
 *               CardType:
 *                 type: string
 *                 example: "Visa"
 *               CardNumber:
 *                 type: string
 *                 example: "4111111111111111"
 *               ExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               CVV:
 *                 type: string
 *                 example: "123"
 *               Method:
 *                 type: string
 *                 example: "Credit Card"
 *     responses:
 *       200:
 *         description: Payment method updated successfully
 *       400:
 *         description: Bad request, missing or invalid data
 *       404:
 *         description: Payment method not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/user/get_payment_method_user:
 *   get:
 *     summary: Get the payment methods for the authenticated user
 *     tags: [Payment Methods]
 *     description: Retrieve all payment methods associated with the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's payment methods
 *       404:
 *         description: User or payment methods not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/user/delete_payment_method_user:
 *   delete:
 *     summary: Delete a user's payment method
 *     tags: [Payment Methods]
 *     description: Remove a specified payment method associated with the authenticated user.
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *       404:
 *         description: User not found or payment method not found
 *       500:
 *         description: Internal server error
 */
