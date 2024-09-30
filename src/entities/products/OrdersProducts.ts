import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Orders } from "../Orders";
import { Products } from "./Products";
import { Users } from "../users/Users";

@Entity()
export class OrdersProducts extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OrderProductID: number;  

  @ManyToOne(() => Orders, (order) => order.OrdersProduct)
  Order: Orders;

  @ManyToOne(() => Products, (product) => product.ProductID)
  Product: Products;

  @Column('int')
  Quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  TotalPrice: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalPrice() {
    this.TotalPrice = this.Product.Price * this.Quantity;
  }
}
