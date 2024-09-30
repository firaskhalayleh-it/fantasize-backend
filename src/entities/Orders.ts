import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
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
  
    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;
  
    @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.PaymentMethodID)
    PaymentMethod: PaymentMethods;
  
    @ManyToOne(() => Addresses, (address) => address.AddressID)
    Address: Addresses;
  
    @OneToMany(() => OrdersProducts, (ordersProduct) => ordersProduct.Order)
    OrdersProduct: OrdersProducts[];
  
    @OneToMany(() => OrdersPackages, (ordersPackages) => ordersPackages.Order)
    OrdersPackages: OrdersPackages[];
  
    @Column('boolean', { default: false })
    Status: boolean; // false = pending, true = purchased
  
    @Column('boolean', { default: false })
    IsGift: boolean;
  
    @Column('boolean')
    IsAnonymous: boolean;
  
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    TotalPrice: number;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  
    calculateTotalPrice() {
      let totalPrice = 0;
  
      if (this.OrdersProduct && this.OrdersProduct.length > 0) {
        this.OrdersProduct.forEach((orderProduct) => {
          totalPrice += orderProduct.TotalPrice;
        });
      }
  
      if (this.OrdersPackages && this.OrdersPackages.length > 0) {
        this.OrdersPackages.forEach((orderPackage) => {
          totalPrice += orderPackage.TotalPrice;
        });
      }
  
      this.TotalPrice = totalPrice;
    }
  }
  