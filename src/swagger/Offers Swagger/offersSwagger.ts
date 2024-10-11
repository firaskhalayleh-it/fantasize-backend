/**
 * @swagger
 * /api/addOffer:
 *   post:
 *     summary: Create a new offer
 *     tags: [Offers]
 *     description: Add a new promotional offer with discount details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IsActive:
 *                 type: boolean
 *                 example: true
 *               Discount:
 *                 type: number
 *                 format: float
 *                 example: 20.5
 *               ValidFrom:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               ValidTo:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *     responses:
 *       200:
 *         description: Offer created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/offers:
 *   post:
 *     summary: Create a new product offer
 *     tags: [Offers]
 *     description: Add a new promotional offer for a specific product.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IsActive:
 *                 type: boolean
 *                 example: true
 *               Discount:
 *                 type: number
 *                 format: float
 *                 example: 15.75
 *               ValidFrom:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               ValidTo:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *               ProductID:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Product offer created successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/offers:
 *   get:
 *     summary: Retrieve all offers
 *     tags: [Offers]
 *     description: Get a list of all offers, including associated products and packages.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of offers retrieved successfully
 *       404:
 *         description: No offers found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/offers/{offerId}:
 *   get:
 *     summary: Retrieve an offer by ID
 *     tags: [Offers]
 *     description: Get details of a specific offer using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: offerId
 *         in: path
 *         required: true
 *         description: The ID of the offer to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Offer retrieved successfully
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/offers/{offerId}:
 *   get:
 *     summary: Retrieve an offer by ID
 *     tags: [Offers]
 *     description: Get details of a specific offer using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: offerId
 *         in: path
 *         required: true
 *         description: The ID of the offer to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Offer retrieved successfully
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/offers/{offerId}:
 *   put:
 *     summary: Update an offer by ID
 *     tags: [Offers]
 *     description: Update the details of a specific offer using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: offerId
 *         in: path
 *         required: true
 *         description: The ID of the offer to update
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
 *               IsActive:
 *                 type: boolean
 *                 example: true
 *               Discount:
 *                 type: number
 *                 format: float
 *                 example: 20.5
 *               ValidFrom:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               ValidTo:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/offers_homeOffers:
 *   get:
 *     summary: Retrieve home offers
 *     tags: [Offers]
 *     description: Fetch a limited number of offers (up to 3) for display on the home page.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers retrieved successfully
 *       404:
 *         description: No offers found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/offers/package:
 *   post:
 *     summary: Create a new offer for a package
 *     tags: [Offers]
 *     description: Allows users to create a new offer associated with a specific package.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IsActive:
 *                 type: boolean
 *                 example: true
 *               Discount:
 *                 type: number
 *                 format: float
 *                 example: 15.5
 *               ValidFrom:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               ValidTo:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-31"
 *               PackageID:
 *                 type: integer
 *                 example: 201
 *             required:
 *               - IsActive
 *               - Discount
 *               - ValidFrom
 *               - ValidTo
 *               - PackageID
 *     responses:
 *       200:
 *         description: Package offer created successfully
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/offers/product/{productId}:
 *   get:
 *     summary: Retrieve all offers for a specific product
 *     tags: [Offers]
 *     description: Fetches all offers associated with a specified product ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product for which to retrieve offers
 *         schema:
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Successfully retrieved offers for the product
 *       404:
 *         description: Product not found or no offers found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/offers/package/{packageId}:
 *   get:
 *     summary: Retrieve all offers for a specific package
 *     tags: [Offers]
 *     description: Fetches all offers associated with a specified package ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         description: The ID of the package for which to retrieve offers
 *         schema:
 *           type: integer
 *           example: 202
 *     responses:
 *       200:
 *         description: Successfully retrieved offers for the package
 *       404:
 *         description: Package not found or no offers found
 *       500:
 *         description: Internal server error
 */
