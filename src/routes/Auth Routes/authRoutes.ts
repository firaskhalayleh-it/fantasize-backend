// register(create user and role) , log in , log out
import express from "express"
import { c_loginUser, c_logOutUser, c_registerUser } from "../../controllers/Auth Controller/authController";
import { authMiddleware } from "../../middlewares/auth_middleware";
const authRoute = express.Router();

/**
 *  @description  register user
 *  @route        /register
 *  @method       Post
 *  @access       public
 * 
 */
authRoute.post("/register",c_registerUser);

/**
 *  @description  log in user
 *  @route        /login
 *  @method       Post
 *  @access       public
 * 
 */
authRoute.post("/login",c_loginUser);

/**
 *  @description  log out user
 *  @route        /logout
 *  @method       Post
 *  @access       private
 * 
 */
authRoute.post("/logout",authMiddleware,c_logOutUser);


//  @description  get user by firebase UID
//  @route        /:userID/firebaseUID
//  @method       Post
//  @access       public
//
// authRoute.post("/user/firebaseUID");

export default authRoute;