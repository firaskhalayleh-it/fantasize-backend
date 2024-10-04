import { Request, Response } from 'express';
import { Users } from '../../entities/users/Users';
import { getRepository } from 'typeorm';
import { uploadFiles } from '../../config/Multer config/multerConfig';
import { Resources } from '../../entities/Resources';

//----------------------- update user by id-----------------------
export const s_updateUser = async (req: Request, res: Response) => {
    try {
        const userId: any = Number(req.params.id);

        const userRepository = getRepository(Users);
        const user = await userRepository.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Destructure fields from the request body
        const { Username, Email, Password, PhoneNumber, Gender } = req.body;

        // Check for email or phone number duplication
        if (Email && Email !== user.Email) {
            const existingEmailUser = await userRepository.findOne({ where: { Email } });
            if (existingEmailUser) {
                return res.status(409).send({ message: "Email already in use" });
            }
        }

        if (PhoneNumber && PhoneNumber !== user.PhoneNumber) {
            const existingPhoneUser = await userRepository.findOne({ where: { PhoneNumber } });
            if (existingPhoneUser) {
                return res.status(409).send({ message: "Phone number already in use" });
            }
        }

        // Update user fields
        user.Username = Username || user.Username;
        user.Email = Email || user.Email;
        user.Password = Password || user.Password;
        user.PhoneNumber = PhoneNumber || user.PhoneNumber;
        user.Gender = Gender || user.Gender;

        // Handle profile picture update
        if (req.files) {
            const resourcesRepository = getRepository(Resources);

            // Remove the existing profile picture if it exists
            const existingProfilePicture = await resourcesRepository.findOne({ where: { User: user } });
            if (existingProfilePicture) {
                await resourcesRepository.remove(existingProfilePicture);
            }

            // Upload new profile picture
            const files = await uploadFiles(req);
            if (files.length > 0) {
                const profilePicture = new Resources();
                profilePicture.entityType = 'user';
                profilePicture.fileType = 'image';
                profilePicture.filePath = `/resources/user_profile/${user.UserID}/${files[0].filename}`;
                profilePicture.User = user;

                await resourcesRepository.save(profilePicture);

                user.UserProfilePicture = profilePicture.filePath;
            }
        }

        // Save updated user
        await userRepository.save(user);

        return res.status(200).send({ message: "User updated successfully", user });

    } catch (err: any) {
        console.log(err);
        return res.status(500).send({ message: err.message });
    }
};


//----------------------- get user by id (and using this to create profile)-----------------------
export const s_getUser = async (req: Request, res: Response) => {
    try {
        const userId: any = req.params.id;
        const user = await Users.findOne({ where: { UserID: userId } })
        if (!user) {
            return "The User Not Found !";
        }
        return user;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- search user by username -----------------------
export const s_searchUser = async (req: Request, res: Response) => {
    try {
        const userName: any = req.params.username;
        const user = await Users.find({ where: { Username: userName } })
        if (!user) {
            return "The User Not Found !";
        }
        return user;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- get all user  -----------------------
export const s_getAllUser = async (req: Request, res: Response) => {
    try {
        const AllUsers = await Users.find();
        return AllUsers;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}



//----------------------- get user username and profile picture-----------------------
export const s_getUserNameWithProfilePic = async (req: Request, res: Response) => {
    try {

        const userId: any = req.params.id;
        const user = await Users.findOne({ where: { UserID: userId } })
        if (!user) {
            return "The User Not Found !";
        }
        const { Username, UserProfilePicture } = user
        return res.status(200).json({ Username, UserProfilePicture });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}