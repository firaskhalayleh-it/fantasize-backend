/**
 * @swagger
 * /user/create_address_user:
 *   post:
 *     tags:
 *       - Addresses
 *     summary: Create or update user address
 *     description: This endpoint allows a user to create a new address or update an existing address.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AddressId:
 *                 type: integer
 *                 description: ID of the address to update (if updating)
 *               AddressLine:
 *                 type: string
 *                 description: Address line of the user's address
 *               City:
 *                 type: string
 *                 description: City of the user's address
 *               State:
 *                 type: string
 *                 description: State of the user's address
 *               Country:
 *                 type: string
 *                 description: Country of the user's address
 *               PostalCode:
 *                 type: string
 *                 description: Postal code of the user's address
 *     responses:
 *       '200':
 *         description: Address updated successfully
 *       '201':
 *         description: Address created successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/update_address_user:
 *   put:
 *     tags:
 *       - Addresses
 *     summary: Update user address
 *     description: This endpoint allows a user to update an existing address.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               AddressId:
 *                 type: integer
 *                 description: ID of the address to update
 *               AddressLine:
 *                 type: string
 *                 description: Address line of the user's address
 *               City:
 *                 type: string
 *                 description: City of the user's address
 *               State:
 *                 type: string
 *                 description: State of the user's address
 *               Country:
 *                 type: string
 *                 description: Country of the user's address
 *               PostalCode:
 *                 type: string
 *                 description: Postal code of the user's address
 *     responses:
 *       '200':
 *         description: Address updated successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/delete_address_user/{addressId}:
 *   delete:
 *     tags:
 *       - Addresses
 *     summary: Delete user address
 *     description: This endpoint allows a user to delete an existing address.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: ID of the address to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Address deleted successfully
 *       '404':
 *         description: User not found or address not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /user/get_address_user:
 *   get:
 *     tags:
 *       - Addresses
 *     summary: Get user addresses
 *     description: This endpoint retrieves all addresses for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Addresses retrieved successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
