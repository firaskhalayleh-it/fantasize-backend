// create addresss , delete , update  get by userId
import express from "express"
import { c_addNewAdress, c_deleteUserAddress, c_getUserAddress, c_updateUserAddress } from "../../controllers/Users Controller/addressController";
import { IsAuthenticated, isAuthorized } from "../../middlewares/isAuthentecated";
const addressRoute = express.Router();

/**
 *  @description  create new adress by userId
 *  @route        /create_address_user
 *  @method       Post
 *  @access       private
 * 
 */
addressRoute.post("/user/create_address_user",IsAuthenticated,c_addNewAdress);

/**
 *  @description  update user address by userId
 *  @route        /update_address_user
 *  @method       Put
 *  @access       private
 * 
 */
addressRoute.put("/user/update_address_user",IsAuthenticated,c_updateUserAddress);

/**
 *  @description  delete user address by userId
 *  @route        /delete_address_user
 *  @method       Delete
 *  @access       private
 * 
 */
addressRoute.delete("/user/delete_address_user/:addressId",IsAuthenticated,c_deleteUserAddress);


/**
 *  @description  get user address by userId
 *  @route        /get_address_user
 *  @method       Get
 *  @access       private
 * 
 */
addressRoute.get("/user/get_address_user",IsAuthenticated,c_getUserAddress);


export default  addressRoute