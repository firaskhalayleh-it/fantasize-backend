// general routes for general data of website as about us and contact us

import { Router } from 'express';
import { c_addGeneral, c_getGeneral, c_updateGeneral } from '../../controllers/general controllers/generalController';
import { c_addContactUs, c_getContactUs, c_getContactUsById } from '../../controllers/general controllers/contactUsController';

const router = Router();


router.get('/general', c_getGeneral);
router.post('/general', c_addGeneral);
router.put('/general', c_updateGeneral);

router.get('/contactUs', c_getContactUs);
router.get('/contactUs/:id', c_getContactUsById);
router.post('/contactUs', c_addContactUs);

