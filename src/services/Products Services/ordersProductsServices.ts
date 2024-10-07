// src/services/Products Services/ordersProductsServices.ts

import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Orders } from '../../entities/Orders';
import { Users } from '../../entities/users/Users';
import { Addresses } from '../../entities/users/Addresses';
import { PaymentMethods } from '../../entities/users/PaymentMethods';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req: Request, res: Response) => {
    try {
        // Extract user ID from authenticated user
        const userId = (req as any).user.payload.userId;

        // Extract product ID and quantity from the request body
        const { productId, quantity } = req.body;
        console.log({ productId, quantity });

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
            where: { User: { UserID: userId }, Status: false },
            relations: ["OrdersProducts", "OrdersProducts.Product"], // Ensure OrdersProducts and Products are loaded
        });

        if (!order) {
            // Create a new order if none exists and initialize OrdersProducts as an empty array
            order = Orders.create({
                User: user,
                Status: false,
                OrdersProducts: [],
            });
            await order.save(); // Save the new order to get an OrderID
        }

        // Check if the product is already in the order
        let orderProduct = order.OrdersProducts.find(
            (op) => op.Product.ProductID === productId
        );

        if (orderProduct) {
            // Update the quantity and total price if it exists
            orderProduct.Quantity += quantity;
            orderProduct.TotalPrice = parseFloat(
                (orderProduct.Quantity * (product.Price)).toFixed(2)
            );
            await orderProduct.save();
        } else {
            // Create a new order product entry
            orderProduct = OrdersProducts.create({
                Order: order,
                Product: product,
                Quantity: quantity,
                TotalPrice: parseFloat((quantity * product.Price).toFixed(2)),
            });
            await orderProduct.save();

            // Push the new order product to the order's OrdersProducts array
            order.OrdersProducts.push(orderProduct);
        }

        // Recalculate the total price of the order
        order.calculateTotalPrice();
        await order.save();

        // Reload the order with updated relations
        order = await Orders.findOne({
            where: { OrderID: order.OrderID },
            relations: [
                "User",
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersProducts.Product.SubCategory",
                "OrdersProducts.Product.ProductCustomization",
            ],
        });

        // Return the updated order
        return res.status(200).json({ message: "Product added to order successfully", order });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};


//----------------------- Update a specific product order-----------------------
export const s_updateOrderProduct = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const { productId, quantity } = req.body;

        const order = await Orders.findOne({ where: { OrderID: orderId } });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        const orderProduct = await OrdersProducts.findOne({
            where: { Order: { OrderID: orderId }, Product: { ProductID: productId } }
        });

        if (!orderProduct) {
            return res.status(404).send({ message: "Order Product not found" });
        }

        if (quantity && quantity !== orderProduct.Quantity) {
            orderProduct.Quantity = quantity;
            orderProduct.TotalPrice = quantity * orderProduct.Product.Price;
            await orderProduct.save();
        }

        // Recalculate the total price of the order
        order.calculateTotalPrice();
        await order.save();

        // Reload the order with updated relations
        const updatedOrder = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["OrdersProducts", "OrdersProducts.Product"]
        });

        return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}


//----------------------- Delete a specific product order-----------------------
export const s_deleteOrderProduct = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const productId = Number(req.params.productId);

        const order = await Orders.findOne({ where: { OrderID: orderId } });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        const orderProduct = await OrdersProducts.findOne({
            where: { Order: { OrderID: orderId }, Product: { ProductID: productId } }
        });

        if (!orderProduct) {
            return res.status(404).send({ message: "Order Product not found" });
        }

        await orderProduct.remove();

        // Recalculate the total price of the order
        order.calculateTotalPrice();
        await order.save();

        // Reload the order with updated relations
        const updatedOrder = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["OrdersProducts", "OrdersProducts.Product"]
        });

        return res.status(200).json({ message: "Order product deleted successfully", order: updatedOrder });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}