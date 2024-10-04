import { Request, Response } from 'express';
import { Packages } from '../../entities/packages/Packages';
import { Users } from '../../entities/users/Users';
import { OrdersPackages } from '../../entities/packages/OrdersPackages';
import { Orders } from '../../entities/Orders';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const { packageId, quantity } = req.body
        if (!quantity || quantity <= 0) {
            return res.status(400).send({ message: "Quantity must be a positive integer" });
        }
        const packages = await Packages.findOne({ where: { PackageID: packageId } });
        if (!packages) {
            return ({ message: "package not found" })
        }
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const orderPkg = await OrdersPackages.findOne({ where: { Package: { PackageID: packageId } } });
        if (!orderPkg) {
            const addOrder = OrdersPackages.create({
                Package: { PackageID: packageId },
                quantity: quantity,
            });
            await addOrder.save();
            const order = Orders.create({
                User: user,
                Status: false,
                
            });
            order.OrdersPackages.push(addOrder);
            await order.save();
            return 'package added successfully';
        }
        return `the package is already added`;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }


}

//----------------------- Update a specific pakcage order-----------------------
export const s_updateOrderPackage = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const packageId = Number(req.params.packageId);
        const quantity  = req.body;
        const order = await Orders.findOne({ where: { OrderID: orderId } });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        const orderPkg = await OrdersPackages.findOne({ where: { Order: { OrderID: orderId }, Package: { PackageID: packageId } } });
        if (!orderPkg) {
            return res.status(404).send({ message: "Order Package not found" });
        }
        if (quantity && quantity !== orderPkg.quantity) {
            orderPkg.quantity = quantity;
            await orderPkg.save();
        }
        return orderPkg;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Delete a specific package order-----------------------
export const s_deleteOrderPackage = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const packageId = Number(req.params.packageId);
        const order = await Orders.findOne({ where: { OrderID: orderId } });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        const orderPkg = await OrdersPackages.findOne({ where: { Order: { OrderID: orderId }, Package: { PackageID: packageId } } });
        if (!orderPkg) {
            return res.status(404).send({ message: "Order Package not found" });
        }
        await orderPkg.remove();
        return res.status(200).send({ message: "Order Package deleted successfully" });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}