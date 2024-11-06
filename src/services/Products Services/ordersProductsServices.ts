// src/services/Products Services/ordersProductsServices.ts

import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Orders } from '../../entities/Orders';
import { Users } from '../../entities/users/Users';
import { Addresses } from '../../entities/users/Addresses';
import { PaymentMethods } from '../../entities/users/PaymentMethods';
import { OrderedCustomization } from '../../entities/OrderedCustomization';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req: Request, res: Response) => {
    try {
        // Extract user ID from authenticated user
        const userId = (req as any).user.payload.userId;

        // Extract product ID, quantity, and ordered options from the request body
        const { productId, quantity, orderedOptions } = req.body;

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

        // Check if the user has an existing pending order
        let order = await Orders.findOne({
            where: {
                User: { UserID: userId },
                Status: false,
            },
            relations: ["User", "OrdersProducts", "OrdersProducts.Product", "OrdersProducts.OrderedCustomization"],
        });

        if (!order) {
            // If no pending order exists, create a new one
            order = Orders.create({
                User: user,
                Status: false,
                OrdersProducts: [],
            });
            await order.save();
        }

        // Check if the product is already in the order
        let orderProduct = order.OrdersProducts.find(
            (op) => op.Product.ProductID === productId
        );

        if (orderProduct) {
            // Update quantity and total price
            orderProduct.Quantity += quantity;
            orderProduct.TotalPrice = parseFloat((orderProduct.Quantity * orderProduct.Product.Price).toFixed(2));
            await orderProduct.save();
        } else {
            // Create a new order product
            orderProduct = OrdersProducts.create({
                Product: product,
                Quantity: quantity,
                TotalPrice: parseFloat((quantity * product.Price).toFixed(2)),
                Order: order,
            });
            await orderProduct.save();
            order.OrdersProducts.push(orderProduct);
            await order.save();
        }

        // Find or create the ordered customization associated with the order product
        let orderedCustomization = await OrderedCustomization.findOne({
            where: { OrdersProducts: { OrderProductID: orderProduct.OrderProductID } }
        });

        if (orderedOptions) {
            const formattedOptions = orderedOptions.map((option: any) => {
                return {
                    name: option.name,
                    type: option.type,
                    optionValues: option.optionValues.map((value: any) => ({
                        name: value.name,
                        value: value.value,
                        isSelected: value.isSelected,
                        filePath: value.filePath,
                    })),
                };
            });

            // Update or create a new customization if it doesn't exist
            if (orderedCustomization) {
                orderedCustomization.SelectedOptions = formattedOptions;
                await orderedCustomization.save();
            } else {
                orderedCustomization = OrderedCustomization.create({
                    SelectedOptions: formattedOptions,
                    OrdersProducts: orderProduct,
                });
                await orderedCustomization.save();
                orderProduct.OrderedCustomization = orderedCustomization;
                await orderProduct.save();
            }
        }


        // Recalculate the total price of the order

        order.calculateTotalPrice();

        await order.save();

        // Reload the order with updated relations to ensure changes are reflected
        const updatedOrder = await Orders.findOne({
            where: { OrderID: order.OrderID },
            relations: [
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersProducts.OrderedCustomization",
                "OrdersProducts.Product.SubCategory",
                "OrdersProducts.Product.SubCategory.Category",
            ],
        });

        return res.status(201).json({ message: "Order created successfully", order: updatedOrder });

    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};




//----------------------- Update a specific product order-----------------------
export const s_updateOrderProduct = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const { productId, quantity, OrderedOptions } = req.body;

        // Find the order by ID with related order products and products
        const order = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["OrdersProducts", "OrdersProducts.Product", "OrdersProducts.OrderedCustomization"]
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        // Find the specific product in the order
        const orderProduct = order.OrdersProducts.find(
            (op) => op.Product.ProductID === productId
        );

        if (!orderProduct) {
            return res.status(404).send({ message: "Order Product not found" });
        }

        // Find or create the ordered customization associated with the order product
        let orderedCustomization = await OrderedCustomization.findOne({
            where: { OrdersProducts: { OrderProductID: orderProduct.OrderProductID } }
        });

        if (OrderedOptions) {
            const formattedOptions = OrderedOptions.map((option: any) => {
                return {
                    name: option.name,
                    type: option.type,
                    optionValues: option.optionValues.map((value: any) => ({
                        name: value.name,
                        value: value.value,
                        isSelected: value.isSelected,
                        filePath: value.filePath,
                    })),
                };
            });

            // Update or create a new customization if it doesn't exist
            if (orderedCustomization) {
                orderedCustomization.SelectedOptions = formattedOptions;
                await orderedCustomization.save();
            } else {
                orderedCustomization = OrderedCustomization.create({
                    SelectedOptions: formattedOptions,
                    OrdersProducts: orderProduct,
                });
                await orderedCustomization.save();
                orderProduct.OrderedCustomization = orderedCustomization;
                await orderProduct.save();
            }
        }

        // Update quantity if it has changed
        if (quantity && quantity !== orderProduct.Quantity) {
            orderProduct.Quantity = quantity;
            orderProduct.TotalPrice = parseFloat((quantity * orderProduct.Product.Price).toFixed(2));
            await orderProduct.save();
        }

        // Recalculate the total price of the order
        order.calculateTotalPrice();
        await order.save();

        // Reload the order with updated relations to ensure changes are reflected
        const updatedOrder = await Orders.findOne({
            where: { OrderID: orderId },
            relations: [
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersProducts.OrderedCustomization",
                "OrdersProducts.Product.SubCategory",
                "OrdersProducts.Product.SubCategory.Category",
            ],
        });

        return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });

    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

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