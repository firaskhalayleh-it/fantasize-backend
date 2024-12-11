// import { NextFunction, Request, Response } from "express";
// import jwt from 'jsonwebtoken';

// export const IsAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
//     const authTokenInCookies = req.cookies.authToken;

//     // Log the token to check if it's correctly received
//     console.log("Auth Token from Cookies:", authTokenInCookies);

//     // Check if the token exists in the cookies
//     if (!authTokenInCookies) {
//         return res.status(401).json({ message: "No token provided inside the cookies" });
//     }

//     // Since the token is directly stored, no need to split
//     const token = authTokenInCookies;

//     try {
//         // Verify the token using the same secret used during signing
//         const decoded = jwt.verify(token, "testScrit");

//         // Attach the decoded payload to the request object
//         (req as any).user = decoded;

//         // Log the user data for debugging purposes
//         console.log("Decoded User:", (req as any).user);
//         console.log("User Role:", (req as any).user.payload.role);

//         // Proceed to the next middleware
//         next();
//     } catch (error) {
//         // If the token is invalid, respond with an error
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };


// export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
//     IsAuthenticated(req, res, () => {
//         console.log((req as any).user.payload.userId);
//         console.log("=================================");
//         console.log(req.params.id);
//         if ((req as any).user.payload.userId === req.params.id || (req as any).user.payload.role === "admin") {
//             next();
//         } else {
//             return res.status(403).json({ message: 'You are not allowed' });
//         }
//     })
// };



import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../utils/jwt-config";



// Middleware لإزالة التحقق بالكامل
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
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    IsAuthenticated(req, res, () => {
        if ((req as any).user.payload.userId === req.params.id || (req as any).user.payload.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: 'You are not allowed' });
        }
    })
};
