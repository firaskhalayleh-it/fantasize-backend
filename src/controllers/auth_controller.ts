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
        const user = await Users.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = generateToken(user.UserID);
        const { Password, ...userData } = user;
        const cookie = createCookie(user.UserID);
        res.setHeader('Set-Cookie', cookie);

        res.status(200).json({ message: 'Login successful', token: token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });

    }
}



