// src/services/Products Services/ordersProductsServices.ts

import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Orders } from '../../entities/Orders';
import { Users } from '../../entities/users/Users';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req: Request, res: Response) => {
    try {
        // Extract user ID from authenticated user
        const userId = (req as any).user.payload.userId;

        // Extract product ID and quantity from the request body
        const { productId, quantity,IsGift,IsAnonymous,PaymentMethodID, AddressID,} = req.body;

        // Validate quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).send({ message: "Quantity must be a positive integer" });
        }

        // Find the product
        const product = await Products.findOne({ where: { ProductID: productId } });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Find the user
        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if the user has an existing pending order (cart)
        let order = await Orders.findOne({
            where: { User: user, Status: false },
            relations: ["OrdersProducts", "OrdersProducts.Product"]
        });

        if (!order) {
            // Create a new order if none exists
            order = Orders.create({
                User: user,
                Status: false,
            });
            await order.save();
            order.OrdersProducts = [];
        }

        // Check if the product is already in the order
        let orderProduct = order.OrdersProducts.find(op => op.Product.ProductID === productId);

        if (orderProduct) {
            // Update the quantity and total price if it exists
            orderProduct.Quantity += quantity;
            orderProduct.TotalPrice = orderProduct.Quantity * product.Price;
            await orderProduct.save();
        } else {
            // Create a new order product entry
            orderProduct = OrdersProducts.create({
                Order: order,
                Product: product,
                Quantity: quantity,
                TotalPrice: quantity * product.Price
            });
            await orderProduct.save();
            order.OrdersProducts.push(orderProduct);
        }

        // Recalculate the total price of the order
        order.calculateTotalPrice();
        await order.save();

        // Reload the order with updated relations
        order = await Orders.findOne({
            where: { OrderID: order.OrderID },
            relations: ["OrdersProducts", "OrdersProducts.Product"]
        });

        // Return the updated order
        return res.status(200).json({ message: "Product added to order successfully", order });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersForUser = async (req: Request, res: Response) => {
    try {
        // Extract user ID from authenticated user
        const userId = (req as any).user.payload.userId;

        // Find the user
        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Get all orders for the user
        const orders = await Orders.find({
            where: { User: { UserID: user.UserID }, Status: false },
            relations: ["OrdersProducts", "OrdersProducts.Product"]

        });
        // Return the orders
        return res.status(200).json({ orders });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Get all orders-----------------------
export const s_getAllOrders = async (req: Request, res: Response) => {
    try {
        // Get all orders
        const orders = await Orders.find({
            relations: ["User", "OrdersProducts", "OrdersProducts.Product", "PaymentMethod", "Address"],
        });

        // Return the orders
        return res.status(200).json({ orders });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

//----------------------- Checkout an order-----------------------
export const s_checkoutOrder = async (req: Request, res: Response) => {
    try {
        // Extract user ID and order ID
        const userId = (req as any).user.payload.userId;
        const orderId = Number(req.params.orderId);

        // Find the user
        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Find the order
        const order = await Orders.findOne({
            where: { OrderID: orderId, Status: false },
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found or already checked out", orderId,order });
        }

        // Update the order status to true (checked out)
        order.Status = true;
        order.calculateTotalPrice();
        await order.save();

        // Return success message
        return res.status(200).json({ message: "Order checked out successfully", order });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}
