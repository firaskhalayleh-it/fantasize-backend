import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Users } from '../entities/users/Users';


const generateToken = async (userid: string) => {
    // Fetch the user along with the related entity (e.g., UserProfilePicture)
    const user = await Users.findOne({
        where: { UserID: userid },
        relations: ['UserProfilePicture', 'Role'],  // Make sure UserProfilePicture is fetched as a relation
    });


    // Check if the user exists and UserProfilePicture contains entityName
    if (!user) {
        throw new Error('User not found');
    }

    // If UserProfilePicture or entityName does not exist, handle it appropriately
    const entityName = user.UserProfilePicture ? user.UserProfilePicture.entityName : 'Unknown';

    // Generate the JWT token with all required fields
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
                } : null, // Include entityName in the payload
            }
        },
        process.env.JWT_SECRET || 'secret', // Use secret from .env or fallback to 'secret'
        { expiresIn: '12h' } // Token expires in 12 hours
    );
};

const verifyToken = (token: string) => {

    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}


export { generateToken, verifyToken }