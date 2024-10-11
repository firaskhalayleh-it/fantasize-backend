/**
 * @swagger
 * /api/reviews/product:
 *   post:
 *     summary: Create a review for a product
 *     tags: [Reviews]
 *     description: Authenticated users can submit a review for a specific product, including a rating and comment.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Rating:
 *                 type: integer
 *                 example: 4
 *                 description: The rating given to the product (1-5 scale).
 *               Comment:
 *                 type: string
 *                 example: "Great product! Highly recommend."
 *                 description: A text comment about the product.
 *               ProductID:
 *                 type: integer
 *                 example: 123
 *                 description: The ID of the product being reviewed.
 *     responses:
 *       200:
 *         description: Review created successfully
 *       404:
 *         description: Product or user not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/package:
 *   post:
 *     summary: Create a review for a package
 *     tags: [Reviews]
 *     description: Authenticated users can submit a review for a specific package, including a rating and comment.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Rating:
 *                 type: integer
 *                 example: 5
 *                 description: The rating given to the package (1-5 scale).
 *               Comment:
 *                 type: string
 *                 example: "Excellent package! Worth the price."
 *                 description: A text comment about the package.
 *               PackageID:
 *                 type: integer
 *                 example: 456
 *                 description: The ID of the package being reviewed.
 *     responses:
 *       200:
 *         description: Review created successfully
 *       404:
 *         description: Package or user not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/reviews/product:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     description: Retrieve all reviews for a specific product by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         description: The ID of the product for which to retrieve reviews.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews
 *       404:
 *         description: Product not found or no reviews found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/reviews/package:
 *   get:
 *     summary: Get all reviews for a package
 *     tags: [Reviews]
 *     description: Retrieve all reviews for a specific package by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: packageId
 *         required: true
 *         description: The ID of the package for which to retrieve reviews.
 *         schema:
 *           type: integer
 *           example: 456
 *     responses:
 *       200:
 *         description: Successfully retrieved reviews
 *       404:
 *         description: Package not found or no reviews found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     description: Deletes a specific review by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         description: The ID of the review to delete.
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     description: Updates the rating or comment of a specific review by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         description: The ID of the review to update.
 *         schema:
 *           type: integer
 *           example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Rating:
 *                 type: integer
 *                 description: The new rating for the review.
 *                 example: 4
 *               Comment:
 *                 type: string
 *                 description: The new comment for the review.
 *                 example: "Updated comment about the product or package."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
