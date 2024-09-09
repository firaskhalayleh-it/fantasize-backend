import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Orders } from '../Orders';
import { Products } from './Products';

@Entity()
export class OrdersProducts {
    @PrimaryColumn()
    OrderID: number;

    @PrimaryColumn()
    ProductID: number;

    @ManyToOne(() => Orders, (order) => order.OrderID)
    Order: Orders;

    @ManyToOne(() => Products, (product) => product.ProductID)
    Product: Products;
}
