
import { DataSource } from "typeorm";
import 'dotenv/config';


export const database = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: false,
    synchronize: true,
    schema: 'public',
    entities: [
        'src/entities/*.ts',
    ],

});


export const initlizeDB = async () => {
    await database.connect().then(() => {
        console.log('database initlized : ', database.isConnected);
    }
    ).catch((error) => {
        console.log('database initlized : ', database.isConnected);

        console.log('database connection error : ', error);


    });







}