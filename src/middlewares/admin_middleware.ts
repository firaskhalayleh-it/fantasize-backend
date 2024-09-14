import { Request, Response, NextFunction } from "express";
import { Users } from "../entities/users/Users";

interface AuthRequest extends Request {
    user?: Users;
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        
        if (!user || user.Role.RoleName !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next(); 
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
