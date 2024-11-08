import { Request ,Response } from "express";
import { Users } from "../../entities/users/Users";
import { Resources } from "../../entities/Resources";
import { generateToken } from "../../utils/jwt-config";
import { Roles } from "../../entities/users/Roles";
import { sendEmail } from "../../utils/email-config";
import { welcomeTemplate } from "../../utils/email-config";

export const s_loginUserUsingGoogle = async (req: Request , res : Response) => {
    const userInfo = (req as any).user;
    console.log("user info:", userInfo);
    
    let user = await Users.findOne({ where: { Email: userInfo.emails[0].value }, relations: ["UserProfilePicture"] });

    if (!user) {
        let role = await Roles.findOne({ where: { RoleName: 'user' } });
        if (!role) {
            role = Roles.create({ RoleName: 'user' });
            role = await role.save();
        }
        user = Users.create({
            Username: userInfo.displayName || userInfo.emails[0].value.split('@')[0],
            Email: userInfo.emails[0].value,
            googleId: userInfo.id,
            Role: role,
        });
        await user.save();

        if (userInfo.picture) {
            const resource = Resources.create({
                entityName: 'UserProfilePicture',
                fileType: 'image/jpeg',
                filePath: userInfo.picture,
                User: user,
            });
            await resource.save();
            user.UserProfilePicture = resource;
            await user.save();
            const emailOptions = {
                to: userInfo.emails[0].value,
                subject: 'Welcome to our platform',
                html: welcomeTemplate(userInfo.displayName)
            };
            await sendEmail(emailOptions);
        }
    } 

    const token = generateToken(user.UserID); 
    res.cookie("authToken", token, { httpOnly: true })

    return { user, token };
};

export const s_loginUserUsingFacebook = async (req: Request  , res: Response) => {
    const userInfo = (req as any).user;

    let user = await Users.findOne({ where: { Email: userInfo.email }, relations: ["UserProfilePicture"] });

    if (!user) {
        let role = await Roles.findOne({ where: { RoleName: 'user' } });
        if (!role) {
            role = Roles.create({ RoleName: 'user' });
            role = await role.save();
        }
        user = Users.create({
            Username: userInfo.name || userInfo.email.split('@')[0],
            Email: userInfo.email,
            facebookId: userInfo.id,
            Role: role,
        });
        await user.save();

        if (userInfo.picture) {
            const resource = Resources.create({
                entityName: 'UserProfilePicture',
                fileType: 'image/jpeg',
                filePath: userInfo.picture,
                User: user,
            });
            await resource.save();
            user.UserProfilePicture = resource;
            await user.save();
            const emailOptions = {
                to: userInfo.email,
                subject: 'Welcome to our platform',
                html: welcomeTemplate(userInfo.name)
            };
            await sendEmail(emailOptions);
        }
    }

    const token = generateToken(user.UserID);
    res.cookie("authToken", token, { httpOnly: true })
    return { user, token };
};
