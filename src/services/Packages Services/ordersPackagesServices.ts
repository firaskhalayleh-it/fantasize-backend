import { Request, Response } from 'express';
import { Packages } from '../../entities/packages/Packages';
import { Users } from '../../entities/users/Users';
import { OrdersPackages } from '../../entities/packages/OrdersPackages';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req:Request , res:Response) =>{
try {
    // const userId = (req as any).user.payload.userId;
    // const {packageId , quantity} = req.body
    // if (!quantity || quantity <= 0) {
    //     return res.status(400).send({ message: "Quantity must be a positive integer" });
    // }
    // const packages = await Packages.findOne({where : {PackageID:packageId}});
    // if(!packages){
    //     return ({ message: "package not found" })
    // }
    // const user = await Users.findOne({ where: { UserID: userId } });
    //     if (!user) {
    //         return res.status(404).send({ message: "User not found" });
    //     }
        
    //     const orderPkg = await OrdersPackages.findOne({where:{User :{UserID:userId ,} ,Package: {PackageID:packageId}}});
    //     const pricePkg= packages.Price *quantity;
    //     if(!orderPkg){
    //         const addOrder =  OrdersPackages.create({
    //             User:userId,
    //             quantity:quantity,
    //             TotalPrice:pricePkg,
    //             Package:[packageId]
    //         });
    //         await addOrder.save();
    //         packages.Quantity-=quantity;
    //         await packages.save();

    //         return addOrder ;
    //     }
    //     return `the package is already added` ;
}catch (err: any) {
    console.log(err);
    res.status(500).send({ message: err.message })
}


} 

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersForUser = async (req:Request , res:Response) =>{
    try {
        // const userId = (req as any).user.payload.userId;
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
    //   const getAllOrdersPackages = await OrdersPackages.find({relations:['User','Package','Address','PaymentMethod']});

    //   if (getAllOrdersPackages.length === 0) {
    //     return res.status(404).send({ message: 'No orders found.' });
    //   }
    //   res.status(200).send(getAllOrdersPackages);
    } catch (err: any) {
      console.error(err);
      res.status(500).send({ message: err.message });
    }
  }

//----------------------- Checkout an order-----------------------
export const s_checkoutOrder = async (req:Request , res:Response) =>{
try {
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