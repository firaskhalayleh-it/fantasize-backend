import { Router } from 'express';
import { c_createPaymentMethod, c_deletePaymentMethod, c_getPaymentMethod, c_updatePaymentMethod } from '../../controllers/Payment methods Controller/paymentMethodsController';
import { isAuthorized } from '../../middlewares/isAuthentecated';

const  paymentMethodRoute = Router();


/**
 *  @description  create new user payment Method by userId
 *  @route        /create_address_user/:userId
 *  @method       Post
 *  @access       private 
 * 
 */
paymentMethodRoute.post("/user/create_payment_method_user/:userId",isAuthorized,c_createPaymentMethod);

/**
 *  @description  update user payment Method by userId
 *  @route        /update_address_user/:userId
 *  @method       Put
 *  @access       private
 * 
 */

paymentMethodRoute.put("/user/update_payment_method_user/:userId",isAuthorized,c_updatePaymentMethod);

/**
 *  @description  get user payment Method by userId
 *  @route        /get_address_user/:userId
 *  @method       Get
 *  @access       private
 * 
 */
paymentMethodRoute.get("/user/get_payment_method_user/:userId",isAuthorized,c_getPaymentMethod);

/**
 *  @description  delete user payment Method by userId
 *  @route        /delete_address_user/:userId
 *  @method       Delete
 *  @access       private
 * 
 */
paymentMethodRoute.delete("/user/delete_payment_method_user/:userId",isAuthorized,c_deletePaymentMethod);


export default paymentMethodRoute;
