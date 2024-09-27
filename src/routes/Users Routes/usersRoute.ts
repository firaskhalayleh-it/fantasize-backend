// update ,delete and get by id(Profile)  ,get all users  , search user using username
import express from "express"
import { c_getAllUser, c_getUser, c_getUserNameWithProfilePic, c_searchUser, c_updateUser } from "../../controllers/Users Controller/userController";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { adminMiddleware } from "../../middlewares/admin_middleware";
import { IsAuthenticated, isAuthorized } from "../../middlewares/isAuthentecated";
const userRoute = express.Router();

/**
 *  @description  update user by id
 *  @route        /update_user/:id
 *  @method       Put
 *  @access       private
 * 
 */
userRoute.put("/update_user/:id",isAuthorized ,c_updateUser);



/**
 *  @description  get user by id (and using this to create profile)
 *  @route        /get_user/:id
 *  @method       Get
 *  @access       private
 * 
 */
userRoute.get("/get_user_detail/:id",isAuthorized,c_getUser);

/**
 *  @description  search user by username 
 *  @route        /search_user/:username
 *  @method       Get
 *  @access       admin
 * 
 */
userRoute.get("/getUser/:username",isAuthorized,c_searchUser);

/**
 *  @description  get all users
 *  @route        /get_all_users
 *  @method       Get
 *  @access       private
 */
userRoute.get("/get_all_users",isAuthorized,c_getAllUser);

/**
 *  @description  get user username and profile picture
 *  @route        /get_user/:id
 *  @method       get
 *  @access       public
 * 
 */
userRoute.get("/getusers/:id", isAuthorized,c_getUserNameWithProfilePic);

export default  userRoute