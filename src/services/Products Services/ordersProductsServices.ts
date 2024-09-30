import { Request, Response } from 'express';
import { Products } from '../../entities/products/Products';
import { OrdersProducts } from '../../entities/products/OrdersProducts';
import { Orders } from '../../entities/Orders';

//----------------------- Create a new order for a user-----------------------
export const s_createNewOrderUser = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const userId = (req as any).user.payload.userId;
        const Quantity = req.body.Quantity;

        const product = await Products.findOne({ where: { ProductID: productId } });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }




        const orderProduct = OrdersProducts.create({
            Product: product,
            Quantity: Quantity,
        });

        await orderProduct.save();

        const order = await Orders.create({
            User: userId,
            OrdersProduct: [orderProduct]
        });

        await order.save();

        return "product added to cart successfully";


    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

}

//----------------------- Get all orders for a user-----------------------
export const s_getAllOrdersForUser = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Get all orders-----------------------
export const s_getAllOrders = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Checkout an order-----------------------
export const s_checkoutOrder = async (req: Request, res: Response) => {
    try {

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
} 