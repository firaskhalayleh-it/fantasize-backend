//route of customization
import express from 'express';
import { c_assignCustomizationToPackage, c_assignCustomizationToProduct, c_createCustomization, c_getAllCustomizations, c_removeCustomizationFromPackage, c_removeCustomizationFromProduct, c_updateCustomization } from '../../controllers/Customizations Controller/customizationController';
import { IsAuthenticated,isAuthorized } from '../../middlewares/isAuthentecated';
import { uploadSingle } from '../../config/Multer config/multerConfig';

const customizationRoute = express.Router();

//create customization
customizationRoute.post('/customization',IsAuthenticated,isAuthorized,uploadSingle, c_createCustomization);

//get all customizations
customizationRoute.get('/customization',IsAuthenticated,isAuthorized, c_getAllCustomizations);

//update customization
customizationRoute.put('/customization',IsAuthenticated,isAuthorized,uploadSingle, c_updateCustomization);


//assign customization to product
customizationRoute.post('/customization/product',IsAuthenticated,isAuthorized, c_assignCustomizationToProduct);

//assign customization to package
customizationRoute.post('/customization/package',IsAuthenticated,isAuthorized, c_assignCustomizationToPackage);


//remove customization from product
customizationRoute.delete('/customization/product',IsAuthenticated,isAuthorized, c_removeCustomizationFromProduct);

//remove customization from package
customizationRoute.delete('/customization/package',IsAuthenticated,isAuthorized, c_removeCustomizationFromPackage);


export default customizationRoute;


