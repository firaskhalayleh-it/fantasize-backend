// src/entities/Orders.ts

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { OrdersPackages } from './packages/OrdersPackages';
import { Addresses } from './users/Addresses';
import { PaymentMethods } from './users/PaymentMethods';
import { Users } from './users/Users';
import { OrdersProducts } from './products/OrdersProducts';
import { before } from 'node:test';

@Entity({ name: 'Orders' })
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'OrderID' })
  OrderID: number;

  @ManyToOne(() => Users, (user) => user.Orders)
  @JoinColumn({ name: 'UserID' })
  User: Users;


  @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.Orders)
  @JoinColumn({ name: 'PaymentMethodID' })
  PaymentMethod: PaymentMethods;

  @ManyToOne(() => Addresses, (address) => address.Orders)
  @JoinColumn({ name: 'AddressID' })
  Address: Addresses;

  @OneToMany(() => OrdersProducts, (ordersProduct) => ordersProduct.Order, { cascade: true, eager: true })
  OrdersProducts: OrdersProducts[] 
  
  @OneToMany(() => OrdersPackages, (ordersPackages) => ordersPackages.Order, { cascade: true, eager: true })
  OrdersPackages: OrdersPackages[]
  


  @Column('boolean',)
  Status: boolean; // false = pending, true = purchased

  @Column('boolean', { default: false })
  IsGift: boolean;

  @Column('boolean', { default: false })
  IsAnonymous: boolean;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  TotalPrice: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
   calculateTotalPrice() {
    let totalPrice = 0;
  
    if (Array.isArray(this.OrdersProducts) && this.OrdersProducts.length > 0) {
      this.OrdersProducts.forEach((orderProduct) => {
        totalPrice += Number(orderProduct.TotalPrice);
      });
    }
  
    if (Array.isArray(this.OrdersPackages) && this.OrdersPackages.length > 0) {
      this.OrdersPackages.forEach((orderPackage) => {
        totalPrice += Number(orderPackage.TotalPrice);
      });
    }
  
    this.TotalPrice = totalPrice;
  }


  @BeforeInsert()
  async checkIfUserHasPendingOrder() {
    const user = await Users.findOne({ where: { UserID: this.User.UserID } });
    if (!user) {
      throw new Error('User not found');
    }

    const pendingOrder = await Orders.findOne({
      where: { User: user, Status: false },
      relations: ['OrdersPackages', 'OrdersProducts'],
    });

    if (pendingOrder) {
      throw new Error('User already has a pending order');
    }

    
  }
  
 
}
