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
  
  @Entity()
  export class Orders extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    OrderID: number;
  
    @ManyToOne(() => Users, (user) => user.Orders)
    User: Users;
  
    @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.Orders, { eager: true })
    PaymentMethod: PaymentMethods;
  
    @ManyToOne(() => Addresses, (address) => address.Orders, { eager: true })
    Address: Addresses;
  
    @OneToMany(() => OrdersProducts, (ordersProduct) => ordersProduct.Order, { cascade: true })
    OrdersProduct: OrdersProducts[];
  
    @OneToMany(() => OrdersPackages, (ordersPackages) => ordersPackages.Order,{ cascade: true})
    OrdersPackages: OrdersPackages[];
  
    @Column('boolean', { default: false })
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
  
      if (this.OrdersProduct && this.OrdersProduct.length > 0) {
        this.OrdersProduct.forEach((orderProduct) => {
          totalPrice += Number(orderProduct.TotalPrice);
        });
      }
  
      if (this.OrdersPackages && this.OrdersPackages.length > 0) {
        this.OrdersPackages.forEach((orderPackage) => {
          totalPrice += Number(orderPackage.TotalPrice);
        });
      }
  
      this.TotalPrice = totalPrice;
    }
  }
  