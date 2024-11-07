import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Users } from "../../entities/users/Users";
import { Roles } from "../../entities/users/Roles";
import { generateToken } from "../../utils/jwt-config";
import createCookie from "../../utils/cookie-config";
import { passwordResetTemplate, sendEmail, welcomeTemplate } from "../../utils/email-config";
import crypto from "crypto";
import { sendWelcomeNotification } from "../../utils/Registration notifications";

//----------------------- Register User-----------------------
export const s_signUpUser = async (req: Request, res: Response) => {
    try {
        const { email, password, DeviceToken } = req.body;
        if (!email || !password) {
            return 'Please provide an email and password';
        }
        const isExist = await Users.findOne({ where: { Email: email } })
        if (isExist) {
            return 'User already exists';
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
                DeviceToken: DeviceToken
            });
            await CreateUser.save();
            await sendWelcomeNotification(CreateUser.UserID); 

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
        if (email == '' || password == '') {
            return ({ error: 'Please provide an email and password' });
        }
        const isExist = await Users.findOne({ where: { Email: email }, relations: ["Role"] })
        if (!isExist) {
            return ({ error: 'Wrong Email Or Password !' });
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
            return ({ error: 'Wrond Email Or Password !' });
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

export const s_resetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        // Find the user by email
        const user = await Users.findOne({ where: { Email: email } });

        // For security reasons, always respond with the same message
        if (!user) {
            return res.status(200).json({ message: 'If that email address is in our system, we have sent a password reset link to it.' });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the reset token before storing it in the database
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set the reset token and expiration on the user record
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);

        await user.save();

        // Create the password reset URL
        const resetURL = `http://localhost:5000/api/reset_password/${hashedToken}`;

        // Send the reset email
        const emailOptions = {
            to: user.Email,
            subject: 'Password Reset Request',
            html: passwordResetTemplate(resetURL),
        };

        await sendEmail(emailOptions);

        // Respond to the user
        return res.status(200).json({ message: 'If that email address is in our system, we have sent a password reset link to it.' });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};