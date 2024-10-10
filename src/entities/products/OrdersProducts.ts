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
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Orders } from "../Orders";
import { Products } from "./Products";
import { OrderedCustomization } from "../OrderedCustomization";

@Entity({ name: 'OrdersProducts' })
export class OrdersProducts extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OrderProductID: number;

  @ManyToOne(() => Orders, (order) => order.OrdersProducts, { onDelete: 'CASCADE' })
  Order: Orders;

  @ManyToOne(() => Products, (product) => product.OrdersProducts, { eager: true })
  Product: Products;

  @OneToOne(() => OrderedCustomization, (orderedCustomization) => orderedCustomization.OrdersProducts, { eager: true })
  @JoinColumn()
  OrderedCustomization: OrderedCustomization;
  

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