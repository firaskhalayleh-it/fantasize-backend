// update ,delete and get by id(Profile)  ,get all users  , search user using username
import express from "express"
import { c_deleteUser, c_getAllUser, c_getUser, c_searchUser, c_updateUser } from "../../controllers/Users Controller/userController";
const userRoute = express.Router();

/**
 *  @description  update user by id
 *  @route        /update_user/:id
 *  @method       Put
 *  @access       private
 * 
 */
userRoute.put("/update_user/:id",c_updateUser);

/**
 *  @description  delete user by id
 *  @route        /delete_user/:id
 *  @method       Delete
 *  @access       private
 * 
 */
userRoute.delete("/delete_user/:id",c_deleteUser);


/**
 *  @description  get user by id (and using this to create profile)
 *  @route        /get_user/:id
 *  @method       Get
 *  @access       private
 * 
 */
userRoute.get("/get_user/:id",c_getUser);

/**
 *  @description  search user by username 
 *  @route        /search_user/:username
 *  @method       Get
 *  @access       public
 * 
 */
userRoute.get("/get_user/:username",c_searchUser);

/**
 *  @description  get all users
 *  @route        /get_all_users
 *  @method       Get
 *  @access       private
 */
userRoute.get("/get_all_users",c_getAllUser);

export default  userRoute