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
  async calculateTotalPrice() {
    if (this.Product && this.Quantity) {
      let finalPrice = Number(this.Product.Price);
      
      if (this.Product.Offer && this.Product.Offer.IsActive) {
        const discount = this.Product.Offer.Discount;
        finalPrice = finalPrice - (finalPrice * (discount / 100));
      }

      this.TotalPrice = finalPrice * this.Quantity;
    }
  }
}