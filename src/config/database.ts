import { DataSource } from "typeorm";

export const database = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 8889,
    username: 'postgres',
    password: 'Just4ral@123',
    database: 'fatasize_test',
    logging: false,
    synchronize: true,
    schema: 'public',
    entities: [
        'src/entities/Role.ts',
        'src/entities/User.ts'
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