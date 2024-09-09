import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Orders } from '../Orders';
import { Packages } from '../packages/Packages';

@Entity()
export class OrdersPackages {
    @PrimaryColumn()
    OrderID: number;

    @PrimaryColumn()
    PackageID: number;

    @ManyToOne(() => Orders, (order) => order.OrderID,)
    Order: Orders;

    @ManyToOne(() => Packages, (pkg) => pkg.PackageID,)
    Package: Packages;
}
