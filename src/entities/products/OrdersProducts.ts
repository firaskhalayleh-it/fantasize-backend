// src/entities/products/OrdersProducts.ts

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Orders } from "../Orders";
import { Products } from "./Products";

@Entity()
export class OrdersProducts extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OrderProductID: number;

  @ManyToOne(() => Orders, (order) => order.OrdersProduct, { onDelete: 'CASCADE' })
  Order: Orders;

  @ManyToOne(() => Products, (product) => product.OrdersProducts)
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
    if (this.Product && this.Quantity) {
      this.TotalPrice = Number(this.Product.Price) * this.Quantity;
    }
  }
}
