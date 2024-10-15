import swaggerJsDoc from 'swagger-jsdoc'
import swagggerUi from 'swagger-ui-express'
import { Express } from 'express'
const PORT = process.env.APP_PORT || 3000;
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
            url :`http://localhost:${PORT}`,
            }
    ],
    },
    apis:['./src/swagger/**/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOption);

export function setupSwagger (app:Express){
    app.use('/api-docs',swagggerUi.serve , swagggerUi.setup(swaggerDocs));
}