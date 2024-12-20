/**
 * @swagger
 * /api/product/{productId}/favorites:
 *   post:
 *     summary: Add a product to the user's favorites
 *     tags: [Product Favorites]
 *     description: Adds the specified product to the authenticated user's favorites list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to add to favorites
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully added the product to favorites
 *       400:
 *         description: Product already in favorites or invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Retrieve all favorite products for the authenticated user
 *     tags: [Product Favorites]
 *     description: Returns a list of products that the user has added to their favorites.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved favorite products
 *       404:
 *         description: No favorite products found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/favorites/{productId}:
 *   delete:
 *     summary: Remove a product from the user's favorites
 *     tags: [Product Favorites]
 *     description: Removes the specified product from the authenticated user's favorites list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to remove from favorites
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully removed the product from favorites
 *       400:
 *         description: Product not in favorites or invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
