// src/services/PackageOrders/ordersPackagesServices.ts

import { Request, Response } from 'express';
import { Packages } from '../../entities/packages/Packages';
import { Users } from '../../entities/users/Users';
import { OrdersPackages } from '../../entities/packages/OrdersPackages';
import { Orders } from '../../entities/Orders';
import { OrderedCustomization } from '../../entities/OrderedCustomization';
import { getRepository } from 'typeorm';
import { or } from 'ip';
import { Resources } from '../../entities/Resources';

// ----------------------- Create a New Package Order -----------------------
export const createNewOrderPackage = async (req: Request, res: Response) => {
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
        Status: 'pending',
      },
      relations: ["User", "OrdersPackages", "OrdersPackages.Package", "OrdersPackages.OrderedCustomization"],
    });

    if (!order) {
      // If no pending order exists, create a new one
      order = new Orders();
      order.User = user;
      order.Status = 'pending';
      order.TotalPrice = 0;
      order.OrdersPackages = [];
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

        if (orderPackage.OrderedCustomization) {
          // Update existing customization
          orderPackage.OrderedCustomization.SelectedOptions = formattedOptions;
          await orderPackage.OrderedCustomization.save();
        } else {
          // Create new customization
          const newCustomization = OrderedCustomization.create({
            SelectedOptions: formattedOptions,
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

        const newCustomization = OrderedCustomization.create({
          SelectedOptions: formattedOptions,
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

// ----------------------- Update a Specific Package Order -----------------------  
export const updateOrderPackage = async (req: Request, res: Response) => {
  try {
    const orderPackageId = Number(req.params.orderPackageId);
    const { quantity, orderedOptions } = req.body;

    const userId = (req as any).user.payload.userId;
    const user = await Users.findOne({ where: { UserID: userId } });

    // Input Validation
    if (  isNaN(orderPackageId)) {
      return res.status(400).send({ message: "Invalid orderId or packageId" });
    }

    // convert ordreredOptions to array if it is not



    if (orderedOptions && !Array.isArray(orderedOptions)) {

      try {
        req.body.orderedOptions = JSON.parse(orderedOptions);
      } catch (err) {
        return res.status(400).send({ message: "orderedOptions must be an array" });
      }
    }

    // Fetch the specific OrdersPackage using QueryBuilder
    const orderPackage = await OrdersPackages.findOne({
      where: {
        OrderPackageID: orderPackageId,
      },
      relations: ["Order", "Package", "OrderedCustomization"],
    });


    if (!orderPackage) {
      return res.status(404).send({ message: "Order Package not found" });
    }

    // Update Quantity if provided
    if (quantity !== undefined && quantity !== orderPackage.quantity) {
      orderPackage.quantity = Number(quantity);
      orderPackage.TotalPrice = parseFloat((quantity * orderPackage.Package.Price).toFixed(2));
      await orderPackage.save();
    }

    if (req.file) {
      const resource = await Resources.findOne({ where: { User: { UserID: user?.UserID } } });
      if (resource) {
        resource.filePath = req.file.path;
        resource.fileType = req.file.mimetype;
        resource.entityName = req.file.filename;
        await Resources.save(resource);
      } else {
        const newResource = new Resources();
        newResource.filePath = req.file.path;
        newResource.fileType = req.file.mimetype;
        newResource.entityName = req.file.filename;
        if (user) {
          newResource.User = user;
        } else {
          return res.status(404).send({ message: "User not found" });
        }
        await Resources.save(newResource);
      }
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

      if (orderPackage.OrderedCustomization) {
        // Update existing customization
        orderPackage.OrderedCustomization.SelectedOptions = formattedOptions;
        await orderPackage.OrderedCustomization.save();
      } else {
        // Create new customization
        const newCustomization = OrderedCustomization.create({
          SelectedOptions: formattedOptions,
          OrdersPackages: orderPackage,
        });
        await newCustomization.save();
        orderPackage.OrderedCustomization = newCustomization;
        await orderPackage.save();
      }
    }
    if (orderPackage.Order.Status == 'rejected') {
      orderPackage.Order.Status = 'under review';
      await orderPackage.Order.save();
    }

    // Recalculate the total price of the order
    const order = await Orders.findOne({
      where: { OrderID: Number(orderPackage.Order.OrderID) },
      relations: ["OrdersPackages", "OrdersPackages.Package"],
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
      where: { OrderID: Number(orderPackage.Order.OrderID) },
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
    console.error("Error in updateOrderPackage:", err);
    res.status(500).send({ message: err.message });
  }
};

// ----------------------- Delete a Specific Package Order -----------------------
export const deleteOrderPackage = async (req: Request, res: Response) => {
  try {
    const orderPackageId = Number(req.params.orderPackageId);

    // Fetch the specific OrderPackage
    const orderPkg = await OrdersPackages.findOne({
      where: {
        OrderPackageID: orderPackageId,
      },
      relations: ["Order", "Package", "OrderedCustomization"]
    });

    if (!orderPkg) {
      return res.status(404).send({ message: "Order Package not found" });
    }

    // Remove the OrderPackage
    await orderPkg.remove();

    // Recalculate the total price of the order
    const order = await Orders.findOne({
      where: { OrderID: orderPkg.Order.OrderID },
      relations: ["OrdersProducts", "OrdersPackages"]
    });

    if (order) {
      await order.calculateTotalPrice();
      await order.save();
    }

    // Reload the order with updated relations
    const updatedOrder = await Orders.findOne({
      where: { OrderID: orderPkg.Order.OrderID },
      relations: ["OrdersProducts", "OrdersPackages", "OrdersProducts.Product", "OrdersPackages.Package"]
    });

    return res.status(200).json({ message: "Order Package deleted successfully", order: updatedOrder });

  } catch (err: any) {
    console.error("Error in deleteOrderPackage:", err);
    res.status(500).send({ message: err.message });
  }
};


// ----------------------- Get order package by id  ----------------------
export const getOrderPackage = async (req: Request, res: Response) => {
  try {
    const orderPackageId = Number(req.params.orderPackageId);

    const orderPackage = await OrdersPackages.findOne({
      where: {
        OrderPackageID: orderPackageId
      },
      relations: ["Order", "Package", "OrderedCustomization", "Package.Resource"]
    });

    if (!orderPackage) {  
      return res.status(404).send({ message: "Order Package not found" });
    }

    return res.status(200).json(orderPackage);

  } catch (err: any) {
    console.error("Error in getOrderPackage:", err);
    res.status(500).send({ message: err.message });
  }
};