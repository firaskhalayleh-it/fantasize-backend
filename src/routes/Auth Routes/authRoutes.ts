// register(create user and role) , log in , log out
import express from "express"
import { c_loginUser, c_logOutUser, c_registerUser,c_resetPassword } from "../../controllers/Auth Controller/authController";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { IsAuthenticated } from "../../middlewares/isAuthentecated";
import { auth } from "firebase-admin";
const authRoute = express.Router();

/**
 *  @description  register user
 *  @route        /register
 *  @method       Post
 *  @access       public
 */
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

authRoute.post("/register",c_registerUser);

/**
 *  @description  log in user
 *  @route        /login
 *  @method       Post
 *  @access       public
 * 
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

authRoute.post("/login",c_loginUser);

/**
 *  @description  log out user
 *  @route        /logout
 *  @method       Post
 *  @access       private
 * 
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
authRoute.post("/logout",IsAuthenticated,c_logOutUser);


/**
 *  @description  reset password
 *  @route        /reset_password
 *  @method       Post
 *  @access       public
 * 
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

authRoute.post("/reset_password",c_resetPassword);


//  @description  get user by firebase UID
//  @route        /:userID/firebaseUID
//  @method       Post
//  @access       public
//
// authRoute.post("/user/firebaseUID");



export default authRoute;