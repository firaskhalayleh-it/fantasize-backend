    /**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: An error occurred while processing your request.
 */

        /**
 * @swagger
 * /api/login:
 *   post:
 *     summary: login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: login successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: An error occurred while processing your request.
 */

           /**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Log out user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: An error occurred while processing your request.
 */


/**
 * @swagger
 * /api/reset_password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting the password reset.
 *     responses:
 *       200:
 *         description: Password reset link sent successfully.
 *       400:
 *         description: Bad request, email is required or invalid.
 *       500:
 *         description: An error occurred while processing your request.
 */


/**
 * @swagger
 * /api/reset_password/{resetToken}:
 *   put:
 *     tags: [Auth]
 *     summary: Reset user password
 *     description: This endpoint allows a user to reset their password using a valid reset token.
 *     parameters:
 *       - name: resetToken
 *         in: path
 *         required: true
 *         description: The reset token for the password reset request
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user
 *                 example: "newPassword123"
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *       '400':
 *         description: Bad Request - Missing password or token expired
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */
