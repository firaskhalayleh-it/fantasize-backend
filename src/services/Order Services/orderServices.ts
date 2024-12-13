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

        // Find the user
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Find the pending order
        const order = await Orders.findOne({
            where: { User: { UserID: user.UserID }, Status: 'pending' },
            relations: ["OrdersPackages", "OrdersProducts"],
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        const emailHtml = orderConfirmationTemplate(order.OrderID.toString(), user.Username);
        const emailOptions: EmailOptions = {
            to: user.Email,
            subject: "Order Confirmation",
            html: emailHtml,
        };

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

        // Ensure the order contains packages or products
        const hasPackages = (order.OrdersPackages?.length ?? 0) > 0;
        const hasProducts = (order.OrdersProducts?.length ?? 0) > 0;

        if (!hasPackages && !hasProducts) {
            return res.status(400).send({ message: "Order is empty" });
        }

        // Flag to indicate if special customization was found
        let specialCustomizationFound = false;

        // Process package quantities
        if (hasPackages) {
            for (const orderPackage of order.OrdersPackages) {
                const packageQuantity = orderPackage.Package?.Quantity;
                if (packageQuantity == null) {
                    return res.status(400).send({ message: "Package quantity not found" });
                }

                // Check for special customization in packages
                if (orderPackage.OrderedCustomization?.SelectedOptions) {
                    for (const option of orderPackage.OrderedCustomization.SelectedOptions) {
                        for (const optionValue of option.optionValues) {
                            if (optionValue.name === 'special customization') {
                                specialCustomizationFound = true;
                            }
                        }
                    }
                }

                orderPackage.Package.Quantity = packageQuantity - orderPackage.quantity;
                await orderPackage.Package.save();

                orderdetails += `- Package: ${orderPackage.Package?.Name ?? "Unknown"},\n Quantity: ${orderPackage.quantity},\n Total Price: ${orderPackage.Package?.Price * orderPackage.quantity}\n\n`;
            }
        }

        // Process product quantities
        if (hasProducts) {
            for (const orderProduct of order.OrdersProducts) {
                const productQuantity = orderProduct.Product?.Quantity;
                if (productQuantity == null) {
                    return res.status(400).send({ message: "Product quantity not found" });
                }

                // Check for special customization in products
                if (orderProduct.OrderedCustomization?.SelectedOptions) {
                    for (const option of orderProduct.OrderedCustomization.SelectedOptions) {
                        for (const optionValue of option.optionValues) {
                            if (optionValue.name === 'special customization') {
                                specialCustomizationFound = true;
                            }
                        }
                    }
                }

                // Deduct product quantity and prepare order details
                orderProduct.Product.Quantity = productQuantity - orderProduct.Quantity;
                await orderProduct.Product.save();

                orderdetails += `- Product: ${orderProduct.Product?.Name ?? "Unknown"}, \n Quantity: ${orderProduct.Quantity},\n Total Price: ${orderProduct.Product?.Price * orderProduct.Quantity}\n\n`;
            }
        }

        // Determine order status based on special customization
        if (specialCustomizationFound) {
            order.Status = 'under review';
        } else {
            order.Status = 'purchased';
        }

        // Update order details
        order.PaymentMethod = paymentMethod;
        order.Address = address;
        order.IsGift = IsGift ?? false;
        order.IsAnonymous = IsAnonymous ?? false;

        await order.save();

        // Send notifications
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
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        console.log(`user is : ${user}`);
        const orders = await Orders.find({
            where: { User: { UserID: userId }, Status: In(["purchased", "under review", "rejected"]) },
            relations: [
                "OrdersProducts",
                "OrdersProducts.Product",
                "OrdersPackages",
                "OrdersPackages.Package"
            ]
        });

        console.log(orders);
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
            where: { User: { UserID: userId }, Status: 'pending' },
            relations: ["OrdersProducts", "OrdersProducts.Product", "OrdersPackages",
                "OrdersPackages.Package", "PaymentMethod", "Address",
                "OrdersProducts.OrderedCustomization", "OrdersProducts.OrderedCustomization"]
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
            where: { Status: In(["purchased", "under review", "rejected"]) },
            relations: ["User", "OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package"]
        });
        console.log('Fetched Orders:', orders);

        return res.status(200).send(orders);
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
        const order = await Orders.findOne({ where: { OrderID: orderId } });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        order.Status = 'purchased';
        approveOrderTemplate(order.OrderID.toString(), order.User?.Username ?? "Unknown");
        await order.save();
        return res.status(200).send({ message: "Order approved successfully", order });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}

export const s_rejectOrder = async (req: Request, res: Response) => {
    try {
        const orderId: any = req.params.orderId;
        const order = await Orders.findOne({ where: { OrderID: orderId } });
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        order.Status = 'rejected';
        rejectOrderTemplate(order.OrderID.toString(), order.User?.Username ?? "Unknown");
        await order.save();
        return res.status(200).send({ message: "Order rejected successfully", order });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}




