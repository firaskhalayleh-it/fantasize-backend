import { Request, Response } from 'express';
import { Users } from '../../entities/users/Users';

//----------------------- update user by id-----------------------
export const s_updateUser = async (req:Request , res:Response) =>{
    try{
        const userId: any = req.params.id;
        const user = await Users.findOne({where :{UserID:userId}})
        if(!user){
            return "The User Not Found !";
        }
        const {Username , Email , Password ,UserProfilePicture,PhoneNumber,Gender} =req.body;
        // This code to check email or phone number is already exist or no , to avoid the duplicate
        if(user.Email !==Email || user.PhoneNumber !==PhoneNumber){
            await Users.update({UserID:userId},{Username,Email,Password,UserProfilePicture,Gender})
            return "Successfully Completed"
        }
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- get user by id (and using this to create profile)-----------------------
export const s_getUser = async (req:Request , res:Response) =>{
    try{
        const userId: any = req.params.id;
        const user = await Users.findOne({where :{UserID:userId}})
        if(!user){
            return "The User Not Found !";
        }
        return user;
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 


//----------------------- search user by username -----------------------
export const s_searchUser = async (req:Request , res:Response) =>{
    try{
        const userName: any = req.params.username;
        const user = await Users.find({where :{Username:userName}})
        if(!user){
            return "The User Not Found !";
        }
        return user;
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 

//----------------------- get all user  -----------------------
export const s_getAllUser = async (req:Request , res:Response) =>{
    try{
        const AllUsers = await Users.find();
        return AllUsers;
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
} 



//----------------------- get user username and profile picture-----------------------
export const s_getUserNameWithProfilePic = async (req:Request , res:Response) =>{
    try{
        
        const userId: any = req.params.id;
        const user = await Users.findOne({where :{UserID:userId}})
        if(!user){
            return "The User Not Found !";
        }
       const {Username,UserProfilePicture} =user
       return res.status(200).json({Username,UserProfilePicture});
    }catch(err:any){
        console.log(err);
        res.status(500).send({message: err.message})
    }
}