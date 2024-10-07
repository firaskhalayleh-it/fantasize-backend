import { Request, Response } from 'express';
import { PaymentMethods } from '../../entities/users/PaymentMethods';
import { Users } from '../../entities/users/Users';

//----------------------- create new user payment Method by userId-----------------------
export const s_createPaymentMethod = async (req: Request, res: Response) => {
    try {
        const { CardType, CardNumber, ExpiryDate, CVV, CardholderName, Method } = req.body;
        const UserId = (req as any).user.payload.userId;

        if (!CardType || !CardNumber || !ExpiryDate || !CVV || !CardholderName || !Method) {
            return res.status(400).send({ message: "Please fill all the fields" })
        }
        const User = await Users.findOne({ where: { UserID: UserId } });
        if (!User) {
            return res.status(404).send({ message: "User not found" })
        }


        const parsedDate = new Date(ExpiryDate);
        if (isNaN(parsedDate.getTime())) {
            return "Invalid date format. Please use 'YYYY-MM-DD' format.";
        }
        await PaymentMethods.create(
            {
                CardType: CardType,
                CardNumber: CardNumber,
                ExpirationDate: parsedDate,
                CardholderName: CardholderName,
                Method: Method,
                CVV: CVV,
                User: User
            }
        ).save();
        return res.status(201).json('paymentMethod created successfully');


    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- update user payment Method by userId-----------------------
export const s_updatePaymentMethod = async (req: Request, res: Response) => {
    try {

        const { CardType, CardNumber, ExpiryDate, CVV, PaymentMethodID, Method } = req.body;
        const UserId = (req as any).user.payload.userId;
        if (!CardType || !CardNumber || !ExpiryDate || !CVV || !PaymentMethodID || !Method) {
            return res.status(400).send({ message: "Please fill all the fields" })
        }

        const paymentMethod = await PaymentMethods.findOne({ where: { PaymentMethodID } });


        if (!paymentMethod) {
            return res.status(404).send({ message: "paymentMethod not found" })
        }

        paymentMethod.CardType = CardType;
        paymentMethod.CardNumber = CardNumber;
        paymentMethod.ExpirationDate = ExpiryDate;
        paymentMethod.CVV = CVV;
        paymentMethod.Method = Method;
        paymentMethod.User = UserId;




        await paymentMethod.save();
        return res.status(200).send({ message: 'paymentMethod updated successfully' });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- get user payment Method by userId-----------------------
export const s_getPaymentMethod = async (req: Request, res: Response) => {
    try {
        const UserId = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: UserId }, relations: ["PaymentMethods"] });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        const paymentMethod = user.PaymentMethods;
        if (!paymentMethod) {
            return res.status(404).json({ message: 'paymentMethod not found!' });
        }
        return res.status(200).json(paymentMethod);

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- delete user payment Method by userId-----------------------
export const s_deletePaymentMethod = async (req: Request, res: Response) => {
    try {
        const UserId = (req as any).user.payload.userId;
        const isExist = Users.findOne({ where: { UserID: UserId } })
        if (!isExist) {
            return `not found user !`;
        }
        const paymentMethodId = Number(req.body.PaymentMethodID)

        const deletePaymentMethod = (await PaymentMethods.delete({ PaymentMethodID: paymentMethodId }));
        if (deletePaymentMethod.affected == 0) {
            return res.status(404).send({ message: "paymentMethod not found" })
        }
        return ('paymentMethod deleted successfully');

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 