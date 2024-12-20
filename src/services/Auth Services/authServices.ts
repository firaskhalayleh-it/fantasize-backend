import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Users } from "../../entities/users/Users";
import { Roles } from "../../entities/users/Roles";
import { generateToken } from "../../utils/jwt-config";
import { passwordResetTemplate, sendEmail, welcomeTemplate } from "../../utils/email-config";
import crypto from "crypto";
import { sendWelcomeNotification } from "../../utils/RegistrationNotifications";
import { Resources } from "../../entities/Resources";
import path from "path";

//----------------------- Register User-----------------------
export const s_signUpUser = async (req: Request, res: Response) => {
    try {
        const { email, password, DeviceToken } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide an email and password" });
        }
        const isExist = await Users.findOne({ where: { Email: email.toUpperCase() } })
        if (isExist) {
            return res.status(409).json({ error: "Wrong Email or Password!" });// User already exists
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
                Email: email.toUpperCase(),
                Password: hashedPassword,
                Role: role,
                DeviceToken: DeviceToken
            });
            await CreateUser.save();
            await sendWelcomeNotification(CreateUser.UserID);

            return res.status(201).json({ message: "User created successfully" });
            // // console.log(CreateUser);
            // res.status(201).json("user created successfully" + token);
        }

    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
}

//-----------------------Log In User-----------------------
export const s_loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password, DeviceToken } = req.body;
        if (email == '' || password == '') {
            if (!res.headersSent) {
                return res.status(400).json({ error: 'Please provide an email and password' });
            }
        }
        const user = await Users.findOne({ where: { Email: email.toUpperCase() } })
        if (!user) {
            return ({ error: 'Wrong Email Or Password !' });
        }

        if (user.Password == null) {
            return res.status(401).send({ error: 'Please Login With Google or use set password through forgot password process' });
        }


        user.DeviceToken = DeviceToken ?? user.DeviceToken;
        user.lastlogin = new Date();
        await user.save();



        const passwordMatch = await bcrypt.compare(password, user!.Password);
        if (passwordMatch) {
            // console.log(isExist);



            const token = await generateToken(user.UserID);
            res.cookie("authToken", token, { httpOnly: true })


            return (token);

        } else {
            return ({ error: 'Wrond Email Or Password !' });
        }





    } catch (err: any) {
        console.log(err);
        if (!res.headersSent) {
            res.status(500).send({ message: err.message });
        }
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
        const user = await Users.findOne({ where: { Email: email.toUpperCase() } });

        // For security reasons, always respond with the same message
        if (!user) {
            return res.status(200).json({ message: 'If that email address is in our system, we have sent a password reset link to it.' });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the reset token before storing it in the database

        // Set the reset token and expiration on the user record
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);

        await user.save();

        // Create the password reset URL

        // Send the reset email
        const emailOptions = {
            to: user.Email,
            subject: 'Password Reset Request',
            html: passwordResetTemplate(resetToken),
        };

        await sendEmail(emailOptions);

        // Respond to the user
        return res.status(200).json({ message: 'If that email address is in our system, we have sent a password reset link to it.' });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};



export const s_signInWithGoogle = async (req: Request, res: Response) => {
    const { email, googleId, DeviceToken, name, } = req.body;

    try {
        // Normalize email to ensure case consistency
        const normalizedEmail = email.trim().toUpperCase();

        let user = await Users.findOne({
            where: [{ Email: normalizedEmail }, { googleId }],
        });

        let profilePicture: Resources | null = null;
        if (req.file) {
            if (!user?.UserProfilePicture) {
                profilePicture = Resources.create({
                    entityName: req.file.filename,
                    filePath: path.join('resources', req.file.filename),
                    fileType: req.file.mimetype,
                });
                profilePicture = await profilePicture.save();
            }
        }

        if (!user) {
            const potentialUsername = name || email.split('@')[0];
            const existingUsername = await Users.findOne({ where: { Username: potentialUsername } });

            const finalUsername = existingUsername
                ? `${potentialUsername}_${Date.now()}`
                : potentialUsername;

            // Check or create the 'user' role
            let role = await Roles.findOne({ where: { RoleName: 'user' } });
            if (!role) {
                role = Roles.create({ RoleName: 'user' });
                role = await role.save();
            }

            user = Users.create({
                Username: finalUsername,
                Email: normalizedEmail,
                googleId,
                Role: role,
                DeviceToken,
                UserProfilePicture: profilePicture || undefined,
                lastlogin: new Date(),
            });
            await user.save();
        } else {
            user.googleId = googleId;
            user.DeviceToken = DeviceToken;
            user.lastlogin = new Date();
            if (req.file) {
                if (!user.UserProfilePicture) {
                    user.UserProfilePicture = profilePicture!;
                } else {
                    user.UserProfilePicture.filePath = path.join('resources', req.file.filename);
                    user.UserProfilePicture.fileType = req.file.mimetype;
                    await user.UserProfilePicture.save();
                }
            }
            await user.save();
        }
        const token = await generateToken(user.UserID);

        res.status(200).json(token);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};


