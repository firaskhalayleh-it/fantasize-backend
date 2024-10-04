import { Request, Response } from 'express';
import { Packages } from '../../entities/packages/Packages';
import { Users } from '../../entities/users/Users';
import { OrdersPackages } from '../../entities/packages/OrdersPackages';
import { Orders } from '../../entities/Orders';


//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.payload.userId;

    const { packageId, quantity, PaymentMethodID, AddressID } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).send({ message: "Quantity must be a positive integer" });
    }

    const pkg = await Packages.findOne({ where: { PackageID: packageId } });
    if (!pkg) {
      return res.status(404).send({ message: "Package not found" });
    }

    const user = await Users.findOne({ where: { UserID: userId } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    let order = await Orders.findOne({
      where: { User: user, Status: false },
      relations: ["OrdersPackages", "OrdersPackages.Package"]
    });

    if (!order) {
      order = Orders.create({
        User: user,
        Status: false,
      });
      await order.save();
      order.OrdersPackages = [];
    }

    let orderPackage = order.OrdersPackages.find(op => op.Package.PackageID === packageId);
    if (orderPackage) {
      orderPackage.quantity += quantity;
      await orderPackage.save();
    } else {
      orderPackage = OrdersPackages.create({
        Order: order,
        Package: pkg,
        quantity: quantity,
        PaymentMethod: { PaymentMethodID },
        Address: { AddressID },
      });
      await orderPackage.save();
      order.OrdersPackages.push(orderPackage);
    }

    order.calculateTotalPrice();
    await order.save();

    order = await Orders.findOne({
      where: { OrderID: order.OrderID },
      relations: ["OrdersPackages", "OrdersPackages.Package"]
    });

    return res.status(200).json({ message: "Package added to order successfully", order });

  } catch (err: any) {
    console.error("Error creating order:", err);
    res.status(500).send({ message: "Internal server error" });
  }
}

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersForUser = async (req:Request , res:Response) =>{
    try {
        const userId = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userId } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const orders = await Orders.find({
            where: { User: { UserID: user.UserID }, Status: false },
            relations: ["OrdersPackages", "OrdersPackages.Package"]
        
        });
        return res.status(200).json({ orders });
        // const getAllOrdersPackagesUser= await OrdersPackages.find({where : {User :{UserID:userId} }});
        // if(!getAllOrdersPackagesUser){
        //     return `sorry not found any orders`
        // }
        // const totalOrdersPrice = getAllOrdersPackagesUser.reduce(
        //     (total: number, orderPkg: { TotalPrice: any }) => {
        //       return total + parseFloat(orderPkg.TotalPrice); // Convert to number before summing
        //     },0 
        //   );
        //   console.log(totalOrdersPrice);

        // return getAllOrdersPackagesUser;
}catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}

} 

//----------------------- Get all orders-----------------------
export const s_getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Orders.find({
            relations: ["User", "OrdersPackages", "OrdersPackages.Package", "PaymentMethod", "Address"],
        });
        return res.status(200).json({ orders });
    } catch (err: any) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  }

//----------------------- Checkout an order-----------------------
export const s_checkoutOrder = async (req:Request , res:Response) =>{
try {
        const userId = (req as any).user.payload.userId;
        const orderId = Number(req.params.orderId);

        const user = await Users.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const order = await Orders.findOne({
            where: { OrderID: orderId, Status: false },
        });

        if (!order) {
            return res.status(404).send({ message: "Order not found or already checked out", orderId,order });
        }

        order.Status = true;
        order.calculateTotalPrice();
        await order.save();

        return res.status(200).json({ message: "Order checked out successfully", order });
    
        // const userId =(req as any).user.payload.userId;
        // const orderId :any=req.params.orderId;
        // const user = await Users.findOne({where :{UserID:userId}});
        // if(!user){
        //     return ` User not found`;
        // };
        // const orderPkg= await OrdersPackages.findOne({where:{Order:{OrderID:orderId} , User:{UserID:user.UserID}}});
        // if(!orderPkg){
        //     return `order package not found or its already checkout`;
        // }
}catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}
} 