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

@Entity()
export class OrdersPackages extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'OrderPackageID' })
  OrderPackageID: number;



  @ManyToOne(() => Orders, (order) => order.OrdersPackages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'OrderID', referencedColumnName: 'OrderID' })
  Order: Orders;
  
  @Column('int', { nullable: true })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  TotalPrice: number;



  @ManyToOne(() => Packages, (pkg) => pkg.OrdersPackages)
  @JoinColumn({ name: 'PackageID', referencedColumnName: 'PackageID' })
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
  async setTotalPrice() {
    this.TotalPrice = this.quantity * this.Package.Price;
  }
}
