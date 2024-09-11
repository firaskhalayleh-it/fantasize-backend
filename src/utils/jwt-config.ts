import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Users } from '../entities/users/Users';
import { Express } from 'express';


const generateToken = (userid: string) => {
    return jwt.sign({ id: userid }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '12h',
    });
}

const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}


export { generateToken, verifyToken }