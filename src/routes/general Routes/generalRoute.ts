// general routes for general data of website as about us and contact us

import { Router } from 'express';
import { c_addGeneral, c_getGeneral, c_updateGeneral } from '../../controllers/general controllers/generalController';
import { c_addContactUs, c_getContactUs, c_getContactUsById } from '../../controllers/general controllers/contactUsController';

const generaroute = Router();


generaroute.get('/general', c_getGeneral);
generaroute.post('/general', c_addGeneral);
generaroute.put('/general', c_updateGeneral);

generaroute.get('/contactUs', c_getContactUs);
generaroute.get('/contactUs/:id', c_getContactUsById);
generaroute.post('/contactUs', c_addContactUs);

export default generaroute;
