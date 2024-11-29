// register(create user and role) , log in , log out
import express from "express";
import { c_loginUser, c_logOutUser, c_registerUser, c_resetPassword, c_signInWithFacebook, c_signInWithGoogle } from "../../controllers/Auth Controller/authController";
import { IsAuthenticated } from "../../middlewares/isAuthentecated";
import { auth } from "firebase-admin";
import { uploadSingle } from "../../middlewares/multerMiddleware";
const authRoute = express.Router();

/**
 *  @description  register user
 *  @route        /register
 *  @method       Post
 *  @access       public
 */

authRoute.post("/register", c_registerUser);

/**
 *  @description  log in user
 *  @route        /login
 *  @method       Post
 *  @access       public
 * 
 */


authRoute.post("/login", c_loginUser);

/**
 *  @description  log out user
 *  @route        /logout
 *  @method       Post
 *  @access       private
 * 
 */

authRoute.post("/logout", IsAuthenticated, c_logOutUser);


/**
 *  @description  reset password
 *  @route        /reset_password
 *  @method       Post
 *  @access       public
 * 
 */


authRoute.post("/reset_password", c_resetPassword);

/**
 *  @description  log in with facebook
 *  @route        /login_with_facebook
 *  @method       Post
 *  @access       public
 * 
 */
authRoute.post("/login_with_facebook", uploadSingle, c_signInWithFacebook);



/**
 *  @description  log in with google
 *  @route        /login_with_google
 *  @method       Post
 *  @access       public
 * 
 */
authRoute.post("/login_with_google", uploadSingle, c_signInWithGoogle);










export default authRoute;