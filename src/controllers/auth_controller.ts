import { Request, Response } from "express";
import { auth } from "firebase-admin";
import { Users } from "../entities/users/Users";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt-config";



export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUserFirebase = await auth(email);
        const existingUser = await Users.findOne({ where: { Email: email } });
        if (existingUser || existingUserFirebase) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = Users.create({ Email: email, Password: hashedPassword });
        await user.save();
        const token = generateToken(user.UserID);

        res.status(201).json("user created successfully" + token + user);


    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });

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
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });

    }
}

export const firebaseLogin = async (req: Request, res: Response) => {
    const  {Token}  = req.body;
    try { 

        const decodedToken = await auth().verifyIdToken(Token);
        const {email,name,uid} = decodedToken;
        let user = await Users.findOne({ where: { Email: email } });

        if (!user) {
           user = Users.create({
                Email: email,
                Username: name,
                firebaseUID: uid,
           });

           await user.save();
        }
       
        const token = generateToken(user.UserID);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });

    }
}
