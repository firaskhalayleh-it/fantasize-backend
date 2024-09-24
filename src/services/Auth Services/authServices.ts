import {Request , Response} from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Users } from "../../entities/users/Users";
import { Roles } from "../../entities/users/Roles";
import { generateToken } from "../../utils/jwt-config";
import createCookie from "../../utils/cookie-config";

//----------------------- Register User-----------------------
export const s_signUpUser = async (req:Request , res :Response) =>{
    try{
        const {email , password} = req.body;
        const isExist= await Users.findOne({where :{Email:email}})
        if(isExist){
            res.status(400).send('Wrond Email Or Password !');
        }else{
        const userName =email.split('@')[0]; // here to convert string to array for take the user name
        const hashedPassword= await bcrypt.hash(password,10)
        let role = await Roles.findOne({ where: { RoleName: 'user' }});
        if (!role) {
            role = Roles.create({ RoleName: 'user' });
            await role.save();
            return res.status(500).json({ message: 'Internal server error' });

        }
        const CreateUser = Users.create({
            Username:userName,
            Email : email,
            Password:hashedPassword,
            Role: role || new Roles(),
        });
        await CreateUser.save();
        const token = generateToken(CreateUser.UserID);
        // console.log(CreateUser);
        res.status(201).json("user created successfully" + token);
        }
        
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
}

//-----------------------Log In User-----------------------
export const s_loginUser = async (req:Request , res :Response) =>{
    try{
        const {email , password} = req.body;
        const isExist= await Users.findOne({where :{Email:email}})
        if(!isExist){
            res.status(400).json({ error: 'Wrond Email Or Password !' });
        }
        const isPasswordValid = await bcrypt.compare(password, isExist!.Password);
        if (!isPasswordValid) {
             res.status(400).json({ error: 'Wrond Email Or Password !' });
        }
        // Generate JWT token
        const token = generateToken(isExist!.UserID);

        // Create the cookies
        const authorizationCookie = createCookie(token, 'authorization');
        const userIDCookie = createCookie(isExist!.UserID, 'UserID');

        // Set multiple cookies in the response
        res.setHeader('Set-Cookie', [authorizationCookie, userIDCookie]);

        // Optionally log the token for debugging
        // console.log(token);

        // Exclude password from user data
        const { Password, ...userData } = isExist!;
        // Send response
        res.status(200).json({ message: 'Login successful', token, user: userData });
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
}
//-----------------------Log Out User-----------------------
export const s_logOutUser = async (req:Request , res:Response) => {
    try {
        // Clear cookies
        res.clearCookie('UserID');
        res.clearCookie('authorization');

        res.status(200).json({ message: 'Logout successful' });
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
}