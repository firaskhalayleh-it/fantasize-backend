import { Request, Response } from "express";
import { Orders } from "../../entities/Orders";
import { Users } from "../../entities/users/Users";
import { OrdersProducts } from "../../entities/products/OrdersProducts";
import { OrdersPackages } from "../../entities/packages/OrdersPackages";
import { PaymentMethods } from "../../entities/users/PaymentMethods";
import { Addresses } from "../../entities/users/Addresses";
import { approveOrderTemplate, EmailOptions, orderConfirmationTemplate, rejectOrderTemplate, sendEmail } from "../../utils/email-config";
import sendOrderNotification from "../../utils/OrderNotification";
import { In } from "typeorm";


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
            where: { User: { UserID: user.UserID }, Status: 'pending' },
            relations: ["OrdersPackages", "OrdersProducts", "OrdersProducts.Product", "OrdersPackages.Package"],
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        // Validate payment method and address
        const paymentMethod = await PaymentMethods.findOne({ where: { PaymentMethodID, User: { UserID: userId } } });
        if (!paymentMethod) {
            return res.status(404).send({ message: "Payment method not found" });
        }

        const address = await Addresses.findOne({ where: { AddressID, User: { UserID: userId } } });
        if (!address) {
            return res.status(404).send({ message: "Address not found" });
        }

        let orderdetails = "Order Summary:\n\n";
        const hasPackages = (order.OrdersPackages?.length ?? 0) > 0;
        const hasProducts = (order.OrdersProducts?.length ?? 0) > 0;

        if (!hasPackages && !hasProducts) {
            return res.status(400).send({ message: "Order is empty" });
        }

        let specialCustomizationFound = false;

        // Check for special customization but do not deduct inventory yet
        if (hasPackages) {
            for (const orderPackage of order.OrdersPackages) {
                if (orderPackage.OrderedCustomization?.SelectedOptions) {
                    for (const option of orderPackage.OrderedCustomization.SelectedOptions) {
                        for (const optionValue of option.optionValues) {
                            if (optionValue.name === 'special customization') {
                                specialCustomizationFound = true;
                            }
                        }
                    }
                }
                // Just build order details here, no inventory change yet if special customization found
                orderdetails += `- Package: ${orderPackage.Package?.Name ?? "Unknown"}, Quantity: ${orderPackage.quantity}, Total Price: ${orderPackage.Package?.Price * orderPackage.quantity}\n\n`;
            }
        }

        if (hasProducts) {
            for (const orderProduct of order.OrdersProducts) {
                if (orderProduct.OrderedCustomization?.SelectedOptions) {
                    for (const option of orderProduct.OrderedCustomization.SelectedOptions) {
                        for (const optionValue of option.optionValues) {
                            if (optionValue.name === 'special customization') {
                                specialCustomizationFound = true;
                            }
                        }
                    }
                }
                orderdetails += `- Product: ${orderProduct.Product?.Name ?? "Unknown"}, Quantity: ${orderProduct.Quantity}, Total Price: ${orderProduct.Product?.Price * orderProduct.Quantity}\n\n`;
            }
        }

        // Update order details (payment, address, etc.)
        order.PaymentMethod = paymentMethod;
        order.Address = address;
        order.IsGift = IsGift ?? false;
        order.IsAnonymous = IsAnonymous ?? false;
        console.log(orderdetails);
        // If special customization is found, set status to under review and do NOT deduct inventory
        if (specialCustomizationFound) {
            order.Status = 'under review';
        } else {
            // Deduct inventory now since it's purchased immediately
            if (hasPackages) {
                for (const orderPackage of order.OrdersPackages) {
                    const packageQuantity = orderPackage.Package?.Quantity;
                    if (packageQuantity == null) {
                        return res.status(400).send({ message: "Package quantity not found" });
                    }
                    orderPackage.Package.Quantity = packageQuantity - orderPackage.quantity;
                    await orderPackage.Package.save();
                }
            }

            if (hasProducts) {
                for (const orderProduct of order.OrdersProducts) {
                    const productQuantity = orderProduct.Product?.Quantity;
                    if (productQuantity == null) {
                        return res.status(400).send({ message: "Product quantity not found" });
                    }
                    orderProduct.Product.Quantity = productQuantity - orderProduct.Quantity;
                    await orderProduct.Product.save();
                }
            }

            order.Status = 'purchased';
        }

        await order.save();
        await sendOrderNotification(userId, order.OrderID.toString(), orderdetails);

        return res.status(200).send({ message: "Order checked out successfully", order });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;

        // Optional: Validate userId format if necessary

        const ordersRepository = (Orders);

        // Implement Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        // Fetch orders with pagination and selective fields
        const [orders, total] = await ordersRepository.findAndCount({
            where: {
                User: { UserID: userId },
                Status: In(["purchased", "under review", "rejected"])
            },
            order: { OrderID: "DESC" },
            relations: [
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersPackages",
                "OrdersPackages.Package"
            ],
            select: [
                "OrderID",
                "Status",
                "IsGift",
                "IsAnonymous",
                "TotalPrice",
                "CreatedAt",
                "UpdatedAt",
                "PaymentMethod",
                "Address",
            ],
            skip,
            take: limit
        });



        return res.status(200).send({
            data: orders,
            total,
            page,
            last_page: Math.ceil(total / limit)
        });
    } catch (err: any) {
        // Use a proper logging mechanism instead of console.log
        console.error('Error fetching user orders:', err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

//----------------------- Get Cart for a user-----------------------
export const s_getCartUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const order = await Orders.findOne({
            where: { User: { UserID: userId }, Status: 'pending' },
            relations: ["OrdersProducts", "OrdersProducts.Product", "OrdersPackages",
                "OrdersPackages.Package", "PaymentMethod", "Address",
                "OrdersProducts.OrderedCustomization", "OrdersProducts.OrderedCustomization"], order: { OrderID: "DESC" }
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

//----------------------- Get all orders -----------------------
export const s_getAllOrdersAdmin = async (req: Request, res: Response) => {
    try {
        const orders = await Orders.find({
            where: {
                Status: In(['pending', 'purchased', 'under review', 'rejected',
                    'shipped', 'delivered', 'returned', 'canceled', 'completed'])
            },
            relations: ["User", "OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package"],
            select: ["OrderID", "TotalPrice", "Status"]
        });

        const formattedOrders = orders.map(order => ({
            OrderID: order.OrderID,
            CustomerName: order.User?.Username ?? "Unknown",
            Price: order.TotalPrice,
            Status: order.Status
        }));

        console.log('Fetched Orders:', formattedOrders);

        return res.status(200).send(formattedOrders);
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message });
    }
}



//----------------------- Get order by id-----------------------
export const s_getOrder = async (req: Request, res: Response) => {
    try {
        const orderId: any = req.params.orderId;
        const order = await Orders.findOne({
            where: { OrderID: orderId },
            relations: ["User", "OrdersProducts",
                "OrdersProducts.Product", "OrdersPackages",
                "OrdersPackages.Package", "PaymentMethod",
                "Address"]
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

//----------------------- Update order status-----------------------
export const s_updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId: any = req.params.orderId;
        const { Status } = req.body;
        const order = await Orders.findOne({ where: { OrderID: orderId } });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        order.Status = Status;
        await order.save();
        return res.status(200).send({ message: "Order status updated successfully", order });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

export const s_approveOrder = async (req: Request, res: Response) => {
    try {
        const orderId: any = req.params.orderId;
        // Load order with products and packages for inventory operations
        const order = await Orders.findOne({
            where: { OrderID: orderId },
            relations: [
                "User",
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersPackages",
                "OrdersPackages.Package"
            ]
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        // Approve only if order is 'under review'
        if (order.Status !== 'under review') {
            return res.status(400).send({ message: "Order must be under review to approve" });
        }

        // Deduct inventory now since we are approving the order
        const hasPackages = (order.OrdersPackages?.length ?? 0) > 0;
        const hasProducts = (order.OrdersProducts?.length ?? 0) > 0;

        if (hasPackages) {
            for (const orderPackage of order.OrdersPackages) {
                const packageQuantity = orderPackage.Package?.Quantity;
                if (packageQuantity == null) {
                    return res.status(400).send({ message: "Package quantity not found" });
                }
                // Deduct the previously ordered quantity
                orderPackage.Package.Quantity = packageQuantity - orderPackage.quantity;
                await orderPackage.Package.save();
            }
        }

        if (hasProducts) {
            for (const orderProduct of order.OrdersProducts) {
                const productQuantity = orderProduct.Product?.Quantity;
                if (productQuantity == null) {
                    return res.status(400).send({ message: "Product quantity not found" });
                }
                // Deduct the previously ordered quantity
                orderProduct.Product.Quantity = productQuantity - orderProduct.Quantity;
                await orderProduct.Product.save();
            }
        }

        order.Status = 'purchased';
        await order.save();
        approveOrderTemplate(order.OrderID.toString(), order.User?.Username ?? "Unknown");

        return res.status(200).send({ message: "Order approved successfully", order });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};


export const s_rejectOrder = async (req: Request, res: Response) => {
    try {
        const orderId: any = req.params.orderId;
        // Load order with related products and packages to revert their quantities
        const order = await Orders.findOne({
            where: { OrderID: orderId },
            relations: [
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersPackages",
                "OrdersPackages.Package"
            ]
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        // If the order had previously deducted inventory (happens usually when status is 'under review' or 'purchased'),
        // we need to restore the inventory when it’s rejected.
        // Check only if the order was previously in a state where inventory was deducted. 
        // Typically, this would be "under review" or "purchased", but you can adjust this logic if needed.
        const previouslyDeductedStates = ["under review", "purchased"];

        if (previouslyDeductedStates.includes(order.Status as string)) {
            // Revert package quantities
            if (order.OrdersPackages && order.OrdersPackages.length > 0) {
                for (const orderPackage of order.OrdersPackages) {
                    if (orderPackage.Package && orderPackage.Package.Quantity !== null && orderPackage.quantity !== null) {
                        // Add back the quantities that were previously deducted
                        orderPackage.Package.Quantity = (orderPackage.Package.Quantity ?? 0) + (orderPackage.quantity ?? 0);
                        await orderPackage.Package.save();
                    }
                }
            }

            // Revert product quantities
            if (order.OrdersProducts && order.OrdersProducts.length > 0) {
                for (const orderProduct of order.OrdersProducts) {
                    if (orderProduct.Product && orderProduct.Product.Quantity !== null && orderProduct.Quantity !== null) {
                        // Add back the quantities that were previously deducted
                        orderProduct.Product.Quantity = (orderProduct.Product.Quantity ?? 0) + (orderProduct.Quantity ?? 0);
                        await orderProduct.Product.save();
                    }
                }
            }
        }

        // Now set order status to 'rejected'
        order.Status = 'rejected';
        await order.save();

        // Optionally send out a reject order email/notification
        rejectOrderTemplate(order.OrderID.toString(), order.User?.Username ?? "Unknown");

        return res.status(200).send({ message: "Order rejected successfully and quantities restored", order });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};

    // get all orders for a user
    export const s_getOrdersForUser = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            // Add pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            // Check if user exists using a lean query
            const userExists = await Users.createQueryBuilder()
                .where("UserID = :userId", { userId })
                .getExists();

            if (!userExists) {
                return res.status(404).send({ message: "User not found" });
            }

            // Use findAndCount for pagination and selective loading
            const [orders, total] = await Orders.findAndCount({
                where: { User: { UserID: userId } },
                relations: [
                    "OrdersProducts",
                    "OrdersProducts.Product",
                    "OrdersPackages",
                    "OrdersPackages.Package"
                ],
                select: [
                    "OrderID",
                    "Status",
                    "TotalPrice",
                    "CreatedAt",
                    "UpdatedAt",
                    "OrdersPackages",
                    "OrdersProducts"
                ],
                order: { CreatedAt: "DESC" },
                skip,
                take: limit
            });

            return res.status(200).send({
                data: orders,
                total,
                page,
                last_page: Math.ceil(total / limit)
            });
        }
        catch (err: any) {
            console.error('Error fetching user orders:', err);
            return res.status(500).send({ message: "Internal Server Error" });
        }
    }






