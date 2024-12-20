import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Users } from '../entities/users/Users';

const generateToken = async (userid: string) => {
    const user = await Users.findOne({
        where: { UserID: userid },
        relations: ['UserProfilePicture', 'Role'],  
    });

    if (!user) {
        throw new Error('User not found');
    }

    const entityName = user.UserProfilePicture ? user.UserProfilePicture.entityName : 'Unknown';

    return jwt.sign(
        {
            payload: {
                userId: user.UserID,
                userName: user.Username,
                email: user.Email,
                role: user.Role.RoleName,
                userProfilePicture: user.UserProfilePicture ? {
                    resourceID: user.UserProfilePicture.ResourceID,
                    entityName: entityName,
                    filePath: user.UserProfilePicture.filePath,
                    fileType: user.UserProfilePicture.fileType
                } : null,
            }
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '12h' }
    );
};

const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}

export { generateToken, verifyToken }
