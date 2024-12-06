import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Users } from '../../entities/users/Users';
import { Resources } from '../../entities/Resources';
// import { uploadFiles } from '../../config/Multer config/multerConfig';
// import { saveMultipleResources } from '../Resources Services/resourceService';

//----------------------- update user by id-----------------------
export const s_updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId || (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Validate if req.body is present
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        // Destructure fields from the request body
        const { Username, Email, Password, PhoneNumber, Gender ,DateOfBirth} = req.body;

        // Check for email or phone number duplication
        if (Email && Email !== user.Email) {
            const existingEmailUser = await Users.findOne({ where: { Email } });
            if (existingEmailUser) {
                return res.status(409).json({ message: "Email already in use" });
            }
        }
        if (PhoneNumber && PhoneNumber !== user.PhoneNumber) {
            const existingPhoneUser = await Users.findOne({ where: { PhoneNumber } });
            if (existingPhoneUser) {
                return res.status(409).json({ message: "Phone number already in use" });
            }
        }

        // Hash the password only if it's provided
        const hashedPassword = Password ? await bcrypt.hash(Password, 10) : user.Password;

        // Update user fields
        user.Username = Username || user.Username;
        user.Email = Email || user.Email;
        user.Password = hashedPassword;
        user.PhoneNumber = PhoneNumber || user.PhoneNumber;
        user.Gender = Gender || user.Gender;
        user.dateofbirth = DateOfBirth || user.dateofbirth  ;

        if (req.file) {
            const resource = await Resources.findOne({ where: { User: {UserID:user.UserID} } });
            if (resource) {
                resource.filePath = req.file.path;
                await Resources.save(resource);
            } else {
                const newResource = new Resources();
                newResource.filePath = req.file.path;
                newResource.fileType = req.file.mimetype;
                newResource.entityName = req.file.fieldname;
                newResource.User = user;
                await Resources.save(newResource);
            }
          }


        // Save updated user
        await user.save();

        return res.status(200).json({ message: "User updated successfully", user });

    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

//----------------------- update user password by token -----------------------
export const s_updateUserPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const resetToken = req.params.resetToken;

        const user = await Users.findOne({ where: { resetPasswordToken: resetToken } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!password) {
            return res.status(400).json({ message: "Please provide a new password" });
        }

        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: "Password reset token has expired" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.Password = hashedPassword;
        user.resetPasswordToken = '';
        
        await Users.save(user);
        return res.status(200).json({ message: "Password updated successfully" });

    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

//----------------------- get user by id (and using this to create profile)-----------------------
export const s_getUser = async (req: Request, res: Response) => {
    try {
        const userId: any = req.params.id;
        const user = await Users.findOne({ where: { UserID: userId } ,relations:['Orders' ,'Addresses' , 'UserProfilePicture']});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

//----------------------- search user by username -----------------------
export const s_searchUser = async (req: Request, res: Response) => {
    try {
        const userName: any = req.params.username;
        const users = await Users.find({ where: { Username: userName } });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(users);
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

//----------------------- get all users  -----------------------
export const s_getAllUser = async (req: Request, res: Response) => {
    try {
        const allUsers = await Users.find();
        return res.status(200).json(allUsers);
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

//----------------------- get user username and profile picture-----------------------
export const s_getUserNameWithProfilePic = async (req: Request, res: Response) => {
    try {
        const userId: any = req.params.id;
        const user = await Users.findOne({ where: { UserID: userId } , relations: ['UserProfilePicture'] });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { Username, UserProfilePicture } = user;
        return res.status(200).json({ Username, UserProfilePicture });
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};
