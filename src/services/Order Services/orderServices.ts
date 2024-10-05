import { Request, Response } from "express";
import { Orders } from "../../entities/Orders";
import { Users } from "../../entities/users/Users";
import { OrdersProducts } from "../../entities/products/OrdersProducts";
import { OrdersPackages } from "../../entities/packages/OrdersPackages";
import { PaymentMethods } from "../../entities/users/PaymentMethods";
import { Addresses } from "../../entities/users/Addresses";


//----------------------- checkout order for a user-----------------------
export const s_checkoutOrderUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const { PaymentMethodID, AddressID, IsGift, IsAnonymous } = req.body;
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const order = await Orders.findOne({
            where: { User: user, Status: false },
            relations: ["OrdersProducts", "OrdersProducts.Product"]
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        const paymentMethod = await PaymentMethods.findOne({ where: { PaymentMethodID } });
        if (!paymentMethod) {
            return res.status(404).send({ message: "Payment method not found" });
        }
        const address = await Addresses.findOne({ where: { AddressID } });
        if (!address) {
            return res.status(404).send({ message: "Address not found" });
        }
        order.OrdersPackages.forEach(async (orderPackage) => {
            orderPackage.Package.Quantity -= orderPackage.quantity;
            await orderPackage.Package.save();
        });
        order.OrdersProducts.forEach(async (orderProduct) => {
            orderProduct.Product.Quantity -= orderProduct.Quantity;
            await orderProduct.Product.save();
        });

        order.PaymentMethod = paymentMethod;
        order.Address = address;
        order.Status = true;
        order.IsGift = IsGift ?? false;
        order.IsAnonymous = IsAnonymous ?? false;


        await order.save();
        return res.status(200).send(order);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userId, } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const orders = await Orders.find({
            where: { User: user, Status: true },
            relations: ["OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package"]
        });
        return res.status(200).send(orders);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get Cart for a user-----------------------
export const s_getCartUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const order = await Orders.findOne({
            where: { User: user, Status: false },
            relations: ["OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package"]
        });
        if (!order) {
            return res.status(404).send({ message: "Cart not found" });
        }
        return res.status(200).send(order);
    }
    catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersAdmin = async (req: Request, res: Response) => {
    try {
        const orders = await Orders.find({
            where: { Status: true },
            relations: ["User", "OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package", "PaymentMethod", "Address"]
        });
        return res.status(200).send(orders);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get order by id-----------------------
export const s_getOrder = async (req: Request, res: Response) => {
    try {
        const orderId: any = req.params.id;
        const order = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["User", "OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package", "PaymentMethod", "Address"]
        });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        return res.status(200).send(order);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}


//----------------------- Get all orders-----------------------
export const s_getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Orders.find({
            relations: ["User", "OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package", "PaymentMethod", "Address"]
        });
        return res.status(200).send(orders);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}


//----------------------- Delete order-----------------------
export const s_deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.id);
        const order = await Orders.findOne({ where: { OrderID: orderId } });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        await order.remove();
        return res.status(200).send({ message: "Order deleted successfully" });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}