import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../utils/jwt-config";



export const IsAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const user = verifyToken(token);
        (req as any).user = user;

        next();
    } catch (error) {
        // If the token is invalid, respond with a 401 Unauthorized error
        return res.status(401).json({ message: 'Invalid token' });
    }
};


export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    IsAuthenticated(req, res, () => {
        console.log((req as any).user.payload.userId);
        console.log("=================================");
        console.log(req.params.id);
        if ((req as any).user.payload.userId === req.params.id || (req as any).user.payload.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: 'You are not allowed' });
        }
    })
};



