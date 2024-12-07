// src/services/ProductOrders/ordersProductsServices.ts

import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Orders } from '../../entities/Orders';
import { Users } from '../../entities/users/Users';
import { OrderedCustomization } from '../../entities/OrderedCustomization';
import { getRepository } from 'typeorm';

// ----------------------- Create a New Product Order -----------------------
export const createNewOrderProduct = async (req: Request, res: Response) => {
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
            order.OrdersProducts = [];
        } else {
            order.OrdersProducts = order.OrdersProducts || [];
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

        // Handle Ordered Options if provided
        if (orderedOptions && Array.isArray(orderedOptions)) {
            const formattedOptions = orderedOptions.map((option: any) => ({
                name: option.name,
                type: option.type,
                optionValues: option.optionValues.map((value: any) => ({
                    name: value.name,
                    value: value.value,
                    isSelected: value.isSelected,
                    filePath: value.filePath,
                })),
            }));

            if (orderProduct.OrderedCustomization) {
                // Update existing customization
                orderProduct.OrderedCustomization.SelectedOptions = formattedOptions;
                await orderProduct.OrderedCustomization.save();
            } else {
                // Create new customization
                const newCustomization = OrderedCustomization.create({
                    SelectedOptions: formattedOptions,
                    OrdersProducts: orderProduct,
                });
                await newCustomization.save();
                orderProduct.OrderedCustomization = newCustomization;
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
                "User",
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersProducts.OrderedCustomization",
                "OrdersProducts.Product.SubCategory",
                "OrdersProducts.Product.SubCategory.Category",
            ],
        });

        return res.status(201).json({ message: "Product added to order successfully", order: updatedOrder });

    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
};

// ----------------------- Update a Specific Product Order -----------------------
export const updateOrderProduct = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const productId = Number(req.params.productId);
        const { quantity, orderedOptions } = req.body;

        // Input Validation
        if (isNaN(orderId) || isNaN(productId)) {
            return res.status(400).send({ message: "Invalid orderId or productId" });
        }

        if (quantity !== undefined && (typeof quantity !== 'number' || quantity <= 0)) {
            return res.status(400).send({ message: "Quantity must be a positive integer" });
        }

        if (orderedOptions && !Array.isArray(orderedOptions)) {
            return res.status(400).send({ message: "orderedOptions must be an array" });
        }

        // Fetch the specific OrderProduct using QueryBuilder
        const orderProduct = await OrdersProducts.findOne({
            where: {
                Order: { OrderID: orderId },
                OrderProductID: productId 
            },
            relations: ["Order", "Product", "OrderedCustomization"]
        });

        if (!orderProduct) {
            return res.status(404).send({ message: "Order Product not found" });
        }

        // Update Quantity if provided
        if (quantity !== undefined && quantity !== orderProduct.Quantity) {
            orderProduct.Quantity = quantity;
            orderProduct.TotalPrice = parseFloat((quantity * orderProduct.Product.Price).toFixed(2));
            await orderProduct.save();
        }

        // Handle Ordered Options if provided
        if (orderedOptions && Array.isArray(orderedOptions)) {
            const formattedOptions = orderedOptions.map((option: any) => ({
                name: option.name,
                type: option.type,
                optionValues: option.optionValues.map((value: any) => ({
                    name: value.name,
                    value: value.value,
                    isSelected: value.isSelected,
                    filePath: value.filePath,
                })),
            }));

            if (orderProduct.OrderedCustomization) {
                // Update existing customization
                orderProduct.OrderedCustomization.SelectedOptions = formattedOptions;
                await orderProduct.OrderedCustomization.save();
            } else {
                // Create new customization
                const newCustomization = OrderedCustomization.create({
                    SelectedOptions: formattedOptions,
                    OrdersProducts: orderProduct,
                });
                await newCustomization.save();
                orderProduct.OrderedCustomization = newCustomization;
                await orderProduct.save();
            }
        }

        // Recalculate the total price of the order
        const order = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["OrdersPackages", "OrdersProducts", "OrdersProducts.Product"],
        });

        if (order) {
            let total = 0;
            for (const op of order.OrdersProducts) {
                total += Number(op.TotalPrice);
            }
            order.TotalPrice = parseFloat(Number(total).toFixed(2));
            await order.save();
        }

        // Reload the order with all relations to return updated data
        const updatedOrder = await Orders.findOne({
            where: { OrderID: orderId },
            relations: [
                "User",
                "OrdersPackages",
                "OrdersPackages.Package",
                "OrdersPackages.OrderedCustomization",
                "OrdersPackages.Package.SubCategory",
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersProducts.OrderedCustomization",
                "OrdersProducts.Product.SubCategory",
                "OrdersProducts.Product.SubCategory.Category",
            ],
        });

        return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });

    } catch (err: any) {
        console.error("Error in updateOrderProduct:", err);
        res.status(500).send({ message: err.message });
    }
};

// ----------------------- Delete a Specific Product Order -----------------------
export const deleteOrderProduct = async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const productId = Number(req.params.productId);

        // Fetch the specific OrderProduct
        const orderProduct = await OrdersProducts.findOne({
            where: {
                Order: { OrderID: orderId },
                Product: { ProductID: productId }
            },
            relations: ["Order", "Product"]
        });

        if (!orderProduct) {
            return res.status(404).send({ message: "Order Product not found" });
        }

        // Remove the OrderProduct
        await orderProduct.remove();

        // Recalculate the total price of the order
        const order = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["OrdersProducts", "OrdersPackages"]
        });

        if (order) {
            await order.calculateTotalPrice();
            await order.save();
        }

        // Reload the order with updated relations
        const updatedOrder = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["OrdersProducts", "OrdersPackages", "OrdersProducts.Product", "OrdersPackages.Package"]
        });

        return res.status(200).json({ message: "Order product deleted successfully", order: updatedOrder });

    } catch (err: any) {
        console.error("Error in deleteOrderProduct:", err);
        res.status(500).send({ message: err.message });
    }
};
