// general routes for general data of website as about us and contact us

import { Router } from 'express';
import { c_addGeneral, c_getGeneral, c_updateGeneral } from '../../controllers/general controllers/generalController';
import { c_addContactUs, c_getContactUs, c_getContactUsById } from '../../controllers/general controllers/contactUsController';
import { isAuthorized } from '../../middlewares/isAuthentecated';

const generaroute = Router();


/** 
 * @description   Get general data
* @route         GET /general/get
* @access        Public
*
**/
generaroute.get('/get', c_getGeneral);

/** 
 * @description   Create general data
 * @route         POST /general/create
 * @access        Private
**/
generaroute.post('/create',isAuthorized, c_addGeneral);

/** 
 * @description   Update general data
 * @route         PUT /general/update
 * @access        Private
 * 
 **/
generaroute.put('/update',isAuthorized, c_updateGeneral);


/** 
 * @description   Get contact us data
 * @route         GET /general/contactUs
 * @access        Public
 * 
 **/
generaroute.get('/contactUs',isAuthorized, c_getContactUs);

/** 
 * @description   Get contact us data by id
 * @route         GET /general/contactUs/:id
 * @access        Public
 * 
 **/

generaroute.get('/contactUs/:id',isAuthorized, c_getContactUsById);

/** 
 * @description   Create contact us data
 * @route         POST /general/contactUs
 * @access        Public
 * 
 **/
generaroute.post('/contactUs',isAuthorized, c_addContactUs);

export default generaroute;
