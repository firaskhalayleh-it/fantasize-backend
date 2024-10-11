/**
 * @swagger
 * /api/favoritePackages/{packageId}:
 *   post:
 *     summary: Add a package to user's favorites
 *     tags: [Favorite Packages]
 *     description: Adds a package user's favorites list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: packageId
 *         in: path
 *         required: true
 *         description: The ID of the package to add to favorites
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       201:
 *         description: Package added to favorites successfully
 *       400:
 *         description: Package already in favorites
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/favoritePackages:
 *   get:
 *     summary: Get all favorite packages for user
 *     tags: [Favorite Packages]
 *     description: Retrieves a list of all favorite packages associated with the user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of favorite packages
 *       404:
 *         description: No favorite products found for the user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/favoritePackages/{packageId}:
 *   delete:
 *     summary: Remove package from favorites
 *     tags: [Favorite Packages]
 *     description: Remove a specific package from the user's list of favorite packages.
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: ID of the package to be removed from favorites.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Package removed from favorites successfully
 *       404:
 *         description: Package or favorite package not found
 *       500:
 *         description: Internal server error
 */
