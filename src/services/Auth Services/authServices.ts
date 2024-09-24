import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Users } from "../../entities/users/Users";
import { Roles } from "../../entities/users/Roles";
import { generateToken } from "../../utils/jwt-config";
import createCookie from "../../utils/cookie-config";

//----------------------- Register User-----------------------
export const s_signUpUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (email! || password!) {
            res.status(400).send('Please provide an email and password');
        }
        const isExist = await Users.findOne({ where: { Email: email } })
        if (isExist) {
            res.status(400).send('Wrong Email Or Password !');
        } else {
            const userName = email.split('@')[0]; // here to convert string to array for take the user name
            const hashedPassword = await bcrypt.hash(password, 10)
            let role = await Roles.findOne({ where: { RoleName: 'user' } });
            if (!role) {
                role = Roles.create({ RoleName: 'user' });
                role = await role.save();
                // return res.status(500).json({ message: 'Internal server error' });

            }
            const CreateUser = Users.create({
                Username: userName,
                Email: email,
                Password: hashedPassword,
                Role: role,
            });
            await CreateUser.save();
            // return res.status(201).send(CreateUser);

            return `user created successfully`;
            // // console.log(CreateUser);
            // res.status(201).json("user created successfully" + token);
        }

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//-----------------------Log In User-----------------------
export const s_loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (email! || password!) {
            res.status(400).json({ error: 'Please provide an email and password' });
        }
        const isExist = await Users.findOne({ where: { Email: email }, relations: ["Role"] })
        if (!isExist) {
            res.status(400).json({ error: 'Wrong Email Or Password !' });
        }
        const passwordMatch = await bcrypt.compare(password, isExist!.Password);
        if (passwordMatch) {
            // console.log(isExist);
            const payload = {
                userId: isExist!.UserID,
                userName: isExist!.Username,
                email: isExist!.Email,
                role: isExist!.Role.RoleName
            }
            const token = jwt.sign({ payload }, "testScrit", { expiresIn: "12h" })
            res.cookie("authToken", token, { httpOnly: false })
            return (token);

        } else {
            res.status(400).json({ error: 'Wrond Email Or Password !' });
        }




        // Generate JWT token
        // const token = generateToken(isExist!.UserID);

        // Create the cookies
        // const authorizationCookie = createCookie(token, 'authorization');
        // const userIDCookie = createCookie(isExist!.UserID, 'UserID');

        // Set multiple cookies in the response
        // res.setHeader('Set-Cookie', [authorizationCookie, userIDCookie]);

        // Optionally log the token for debugging
        // console.log(token);

        // Exclude password from user data
        // const { Password, ...userData } = isExist!;
        // Send response
        // res.status(200).json({ message: 'Login successful', token, user: userData });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}
//-----------------------Log Out User-----------------------
export const s_logOutUser = async (req: Request, res: Response) => {
    try {
        // Clear cookies
        // res.clearCookie('UserID');
        // res.clearCookie('authorization');
        res.clearCookie('authToken')
        res.send("logged out")

        // res.status(200).json({ message: 'Logout successful' });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}