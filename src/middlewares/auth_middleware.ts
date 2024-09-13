import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt-config';  
import { Users } from '../entities/users/Users';  

export interface AuthRequest extends Request {
    user?: Users;
}   



export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Check Authorization from cookie first
        const tokenFromCookie = req.cookies?.authorization;

        // Check Authorization from header (Bearer token)
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const tokenFromHeader = authHeader && (authHeader as string).split(' ')[1];

        // Use token from either cookie or header
        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token
        const decoded: any = verifyToken(token);
        if (!decoded) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // Find the user based on the token
        const user = await Users.findOne({ where: { UserID: decoded.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
