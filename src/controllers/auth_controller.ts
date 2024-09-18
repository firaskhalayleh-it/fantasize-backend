import { Request, Response } from "express";
import { Users } from "../entities/users/Users";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt-config";
import { Roles } from "../entities/users/Roles";
import createCookie from "../utils/cookie-config";



export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password ) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const existingUser = await Users.findOne({ where: { Email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = email.split('@')[0];
        let role = await Roles.findOne({ where: { RoleName: 'user' } });
        if (!role) {
            role = Roles.create({ RoleName: 'user' });
            await role.save();  
            return res.status(500).json({ message: 'Internal server error' });
        }
        const user = Users.create({
            Email: email,
            Password: hashedPassword,
            Username: username,
            Role: role || new Roles(),


        })

        console.log(user);
        await user.save();
        const token = generateToken(user.UserID);

        res.status(201).json("user created successfully" + token);


    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' ,error:error});

    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await Users.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = generateToken(user.UserID);

        // Create the cookies
        const authorizationCookie = createCookie(token, 'authorization');
        const userIDCookie = createCookie(user.UserID, 'UserID');

        // Set multiple cookies in the response
        res.setHeader('Set-Cookie', [authorizationCookie, userIDCookie]);

        // Optionally log the token for debugging
        console.log(token);

        // Exclude password from user data
        const { Password, ...userData } = user;

        // Send response
        res.status(200).json({ message: 'Login successful', token, user: userData });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        // Clear cookies
        res.clearCookie('authorization');
        res.clearCookie('UserID');

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};