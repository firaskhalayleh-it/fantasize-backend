// src/services/Products Services/ordersProductsServices.ts

import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Orders } from '../../entities/Orders';
import { Users } from '../../entities/users/Users';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;

        const { productId, quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).send({ message: "Quantity must be a positive integer" });
        }

        const product = await Products.findOne({ where: { ProductID: productId } });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let order = await Orders.findOne({ 
            where: { User: user, Status: false },
            relations: ["OrdersProduct", "OrdersProduct.Product"]
        });

        if (!order) {
            order = Orders.create({
                User: user,
                Status: false,
            });
            await order.save();
            order.OrdersProduct = [];
        }

        let orderProduct = order.OrdersProduct.find(op => op.Product.ProductID === productId);

        if (orderProduct) {
            orderProduct.Quantity += quantity;
            orderProduct.TotalPrice = orderProduct.Quantity * product.Price;
            await orderProduct.save();
        } else {
            orderProduct = OrdersProducts.create({
                Order: order,
                Product: product,
                Quantity: quantity,
                TotalPrice: quantity * product.Price
            });
            await orderProduct.save();
            order.OrdersProduct.push(orderProduct);
        }

        order.calculateTotalPrice();
        await order.save();

        order = await Orders.findOne({ 
            where: { OrderID: order.OrderID },
            relations: ["OrdersProduct", "OrdersProduct.Product"]
        });

        return res.status(200).json({ message: "Product added to order successfully", order });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersForUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;

        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const orders = await Orders.find({
            where: { User: user },
            relations: ["OrdersProduct", "OrdersProduct.Product", "PaymentMethod", "Address"],
            order: { CreatedAt: "DESC" }
        });

        return res.status(200).json({ orders });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get all orders-----------------------
export const s_getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Orders.find({
            relations: ["User", "OrdersProduct", "OrdersProduct.Product", "PaymentMethod", "Address"],
            order: { CreatedAt: "DESC" }
        });

        return res.status(200).json({ orders });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Checkout an order-----------------------
export const s_checkoutOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const orderId = Number(req.params.orderId);

        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const order = await Orders.findOne({
            where: { OrderID: orderId, User: user, Status: false },
            relations: ["OrdersProduct", "OrdersProduct.Product"]
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found or already checked out" });
        }

        order.Status = true;
        order.calculateTotalPrice();
        await order.save();

        return res.status(200).json({ message: "Order checked out successfully", order });


    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}
