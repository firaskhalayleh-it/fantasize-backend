import { Request, Response } from 'express';
import { Users } from '../../entities/users/Users';
import { Addresses } from '../../entities/users/Addresses';

//----------------------- Add new adress by userId----------------------

export const s_addNewOrUpdateAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        console.log(userId);
        const user = await Users.findOne({ where: { UserID: userId }, relations: ["Addresses"] });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const { AddressId, AddressLine, City, State, Country, PostalCode } = req.body;

        let address;
        let statusCode;

        if (AddressId && AddressId !== '') {
            // Try to find the existing address
            address = await Addresses.findOne({ where: { AddressID: AddressId } });

            if (address) {
                // Update the existing address
                address.AddressLine = AddressLine;
                address.City = City;
                address.State = State;
                address.Country = Country;
                address.PostalCode = PostalCode;
                address.User = user; // Ensure the address is associated with the correct user

                await Addresses.save(address);

                statusCode = 200; // OK
            } else {
                // AddressId provided but address not found, create a new address
                address = Addresses.create({
                    AddressLine,
                    City,
                    State,
                    Country,
                    PostalCode,
                    User: user
                });

                await Addresses.save(address);

                statusCode = 201; // Created
            }
        } else {
            // No AddressId provided, create a new address
            address = Addresses.create({
                AddressLine,
                City,
                State,
                Country,
                PostalCode,
                User: user
            });

            await Addresses.save(address);

            statusCode = 201; // Created
        }

        // Exclude the user from the response
        const { User, ...addressWithoutUser } = address;

        return res.status(statusCode).json(addressWithoutUser);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err });
    }
};






//----------------------- delete user address by userId-----------------------
export const s_deleteUserAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const isExist = Users.findOne({ where: { UserID: userId } })
        if (!isExist) {
            return `not found user !`;
        }
        const addressId = Number(req.params.addressId)
        const deleteAddress = await Addresses.delete({ AddressID: addressId });
        if(deleteAddress.affected==0){
            return `Not found address to delete`
        }
        return `Deleted successfully`
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- get user address by userId -----------------------
export const s_getUserAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userId }, relations: ["Addresses"] });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        const address = user.Addresses;
        
        return res.status(200).json(address);

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

}

