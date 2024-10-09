import swaggerJsDoc from 'swagger-jsdoc'
import swagggerUi from 'swagger-ui-express'
import { Express } from 'express'

const swaggerOption ={
    definition :{
        openapi:'3.0.0',
        info:{
            title:'My FantaSize Apis',
            version:'1.0.0',
            description:'API Doscumentation'
        },
        servers:[
            {
            url :'http://localhost:5000'
            }
    ],
    },
    apis:['./src/routes/**/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOption);

export function setupSwagger (app:Express){
    app.use('/api-docs',swagggerUi.serve , swagggerUi.setup(swaggerDocs));
}