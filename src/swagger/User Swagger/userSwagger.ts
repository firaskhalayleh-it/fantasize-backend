
/**
 * @swagger
 * /api/update_user:
 *     put:
 *       tags: [Users]
 *       summary: Update a user by their ID
 *       description: This endpoint allows an authenticated user to update their profile information, including Username, Email, Password, PhoneNumber, Gender, Date of Birth, and Profile Picture.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 Username:
 *                   type: string
 *                   description: New username for the user
 *                   example: firas yahia
 *                 Email:
 *                   type: string
 *                   description: New email for the user. Must be unique.
 *                   format: email
 *                   example: test@test.com
 *                 Password:
 *                   type: string
 *                   description: New password for the user
 *                   format: password
 *                 PhoneNumber:
 *                   type: string
 *                   description: New phone number for the user must be unique.
 *                   format: 
 *                 Gender:
 *                   type: string
 *                   enum: [Male, Female, Other]
 *                   description: User's gender
 *                 DateOfBirth:
 *                   type: string
 *                   format: date
 *                   description: User's date of birth in YYYY-MM-DD format
 *                 file:
 *                   type: string
 *                   format: binary
 *                   description: Profile picture to upload
 *       responses:
 *         '200':
 *           description: User updated successfully
 *         '400':
 *           description: Bad Request - Missing body or invalid data
 *         '404':
 *           description: User not found
 *         '500':
 *           description: Internal Server Error
 *       security:
 *         - bearerAuth: []
 */

/**
 * @swagger
 * /api/get_user_detail/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user details by user ID
 *     description: Retrieve the details of a user based on the provided user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User details retrieved successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/getUser/{username}:
 *   get:
*     tags: 
*       - Users
*     summary: Search for users by username
*     description: Retrieves a list of users matching the specified username. 
*     parameters:
*       - name: username
*         in: path
*         required: true
*         description: The username of the user to search for.
*         schema:
*           type: string
 *     responses:
 *       '200':
 *         description: Users found successfully
 *       '404':
 *         description: No users found
 *       '500':
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/get_all_users:
 *   get:
 *     tags: 
 *       - Users
 *     summary: Get a list of all users
 *     description: Retrieves a list of all registered users in the system.
 *     responses:
 *       '200':
 *         description: Successfully retrieved all users
 *       '500':
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/getusers/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID with their profile picture
 *     description: Retrieves a user's username and profile picture based on the provided user ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user information
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 *     security:
 *       - bearerAuth: []
 */

