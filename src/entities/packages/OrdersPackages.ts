import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Users } from '../users/Users';
import { PaymentMethods } from '../users/PaymentMethods';
import { Addresses } from '../users/Addresses';
import { Packages } from './Packages';
import { Orders } from '../Orders';
import { before } from 'node:test';

@Entity({ name: 'OrdersPackages' })
export class OrdersPackages extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'OrderPackageID' })
  OrderPackageID: number;



  @ManyToOne(() => Orders, (order) => order.OrdersPackages, { onDelete: 'CASCADE' })
  Order: Orders;

  @Column('int', { nullable: true })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  TotalPrice: number;



  @ManyToOne(() => Packages, (pkg) => pkg.OrdersPackages, { onDelete: 'CASCADE', eager: true })
  Package: Packages;


  @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.PaymentMethodID)
  PaymentMethod: PaymentMethods;

  @ManyToOne(() => Addresses, (address) => address.AddressID)
  Address: Addresses;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;



  @BeforeInsert()
  @BeforeUpdate()
  async calculateTotalPrice() {
    if (this.Package && this.Package.Price && this.quantity) {
      let finalPrice = this.Package.Price;
      
      if (this.Package.Offer && this.Package.Offer.IsActive) {
        const discount = this.Package.Offer.Discount;
        finalPrice = finalPrice - (finalPrice * (discount / 100));
      }

      this.TotalPrice = finalPrice * this.quantity;
    }
  }

}
