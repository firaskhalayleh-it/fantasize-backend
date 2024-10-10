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
    schema: 'fatansize_test',
    entities: [
        'src/entities/**/*.ts',
        'src/entities/*.ts',
    ],
    migrations: ['src/migrations/*.ts'],
    
});

export const initializeDB = async () => {
    try {
        await database.initialize();
        console.log('Database initialized successfully');
    } catch (err: any) {
        console.error('Database initialization failed:', err);
    }
};
