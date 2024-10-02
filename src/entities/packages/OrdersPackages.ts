import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "../Orders";
import { Packages } from "./Packages";

@Entity()
export class OrdersPackages extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OrderPackageID: number; 

  @ManyToOne(() => Orders, (order) => order.OrdersPackages)
  Order: Orders;

  @ManyToOne(() => Packages, (packages) => packages.OrdersPackages)
  Package: Packages;

  @Column('int')
  Quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  TotalPrice: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  calculateTotalPrice() {
    this.TotalPrice = this.Package.Price * this.Quantity;
  }
}
