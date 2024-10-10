import { Request, Response } from 'express';
import { Packages } from '../../entities/packages/Packages';
import { Users } from '../../entities/users/Users';
import { OrdersPackages } from '../../entities/packages/OrdersPackages';
import { Orders } from '../../entities/Orders';
import { OrderedCustomization } from '../../entities/OrderedCustomization';

export const s_createNewOrderUser = async (req: Request, res: Response) => {
  try {
    // Extract user ID from authenticated user
    const userId = (req as any).user.payload.userId;

    // Extract package ID, quantity, and ordered options from the request body
    const { packageId, quantity, orderedOptions } = req.body;
    console.log({ packageId, quantity });

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).send({ message: "Quantity must be a positive integer" });
    }

    // Find the package
    const packageEntity = await Packages.findOne({ where: { PackageID: packageId } });
    if (!packageEntity) {
      return res.status(404).send({ message: "Package not found" });
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
      relations: ["User", "OrdersPackages", "OrdersPackages.Package", "OrdersPackages.OrderedCustomization"],
    });

    if (!order) {
      // If no pending order exists, create a new one
      order = Orders.create({
        User: user,
        Status: false,
        OrdersPackages: [],
      });
      await order.save();
    }

    // Check if the package is already in the order
    let orderPackage = order.OrdersPackages.find(
      (op) => op.Package.PackageID === packageId
    );

    if (orderPackage) {
      // Update quantity and total price
      orderPackage.quantity += quantity;
      orderPackage.TotalPrice = parseFloat(
        (orderPackage.quantity * packageEntity.Price).toFixed(2)
      );
      await orderPackage.save();

      // Update or create customization if orderedOptions are provided
      if (orderedOptions && Array.isArray(orderedOptions)) {
        if (orderPackage.OrderedCustomization) {
          orderPackage.OrderedCustomization.SelectedOptions = orderedOptions;
          await orderPackage.OrderedCustomization.save();
        } else {
          const newCustomization = OrderedCustomization.create({
            SelectedOptions: orderedOptions,
            OrdersPackages: orderPackage,
          });
          await newCustomization.save();
          orderPackage.OrderedCustomization = newCustomization;
          await orderPackage.save();
        }
      }
    } else {
      // Create a new order package entry
      const newOrderPackage = OrdersPackages.create({
        Order: order,
        Package: packageEntity,
        quantity: quantity,
        TotalPrice: parseFloat((quantity * packageEntity.Price).toFixed(2)),
      });

      // If orderedOptions are provided, create a new customization
      if (orderedOptions && Array.isArray(orderedOptions)) {
        const newCustomization = OrderedCustomization.create({
          SelectedOptions: orderedOptions,
          OrdersPackages: newOrderPackage,
        });
        await newCustomization.save();
        newOrderPackage.OrderedCustomization = newCustomization;
      }

      // Save the new order package
      await newOrderPackage.save();

      // Add the new order package to the order's OrdersPackages array
      order.OrdersPackages.push(newOrderPackage);
    }

    // Recalculate the total price of the order
    order.calculateTotalPrice();
    await order.save();

    // Reload the order with all relations
    order = await Orders.findOne({
      where: { OrderID: order.OrderID },
      relations: [
        "User",
        "OrdersPackages",
        "OrdersPackages.Package",
        "OrdersPackages.Package.SubCategory",
        "OrdersPackages.OrderedCustomization",
      ],
    });

    // Return the updated order
    return res.status(200).json({ message: "Package added to order successfully", order });
  } catch (err: any) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};


//----------------------- Update a specific pakcage order-----------------------
export const s_updateOrderPackage = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);
    const packageId = Number(req.params.packageId);
    const { quantity, orderedOptions } = req.body;

    // Find the order by ID
    const order = await Orders.findOne({
      where: { OrderID: orderId },
      relations: ["OrdersPackages", "OrdersPackages.Package", "OrdersPackages.OrderedCustomization"],
    });

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Find the specific package in the order
    const orderPackage = order.OrdersPackages.find((op) => op.Package.PackageID === packageId);
    if (!orderPackage) {
      return res.status(404).send({ message: "Order Package not found" });
    }

    // Update the quantity if provided
    if (quantity && quantity !== orderPackage.quantity) {
      orderPackage.quantity = quantity;
      orderPackage.TotalPrice = parseFloat((quantity * orderPackage.Package.Price).toFixed(2));
      await orderPackage.save();
    }

    // Handle ordered options and update or create customization
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

      if (orderPackage.OrderedCustomization) {
        // Update existing customization
        orderPackage.OrderedCustomization.SelectedOptions = formattedOptions;
        await orderPackage.OrderedCustomization.save();
      } else {
        // Create a new customization if it doesn't exist
        const newCustomization = OrderedCustomization.create({
          SelectedOptions: formattedOptions,
          OrdersPackages: orderPackage,
        });
        await newCustomization.save();
        orderPackage.OrderedCustomization = newCustomization;
        await orderPackage.save();
      }
    }

    // Recalculate the total price of the order
    order.calculateTotalPrice();
    await order.save();

    // Reload the order with all relations to return updated data
    const updatedOrder = await Orders.findOne({
      where: { OrderID: orderId },
      relations: [
        "User",
        "OrdersPackages",
        "OrdersPackages.Package",
        "OrdersPackages.OrderedCustomization",
        "OrdersPackages.Package.SubCategory",
      ],
    });

    return res.status(200).json({ message: "Order Package updated successfully", order: updatedOrder });
  } catch (err: any) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};


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