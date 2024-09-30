import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "../Orders";
import { Packages } from "./Packages";
import { Users } from "../users/Users";

@Entity()
export class OrdersPackages extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OrderPackageID: number; 

  @ManyToOne(() => Orders, (order) => order.OrdersPackages)
  Order: Orders;

  @ManyToOne(() => Packages, (packages) => packages.PackageID)
  Package: Packages;

  @ManyToOne(() => Users, (user) => user.UserID)
  User: Users;

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
