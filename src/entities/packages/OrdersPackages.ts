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
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Users } from '../users/Users';
import { PaymentMethods } from '../users/PaymentMethods';
import { Addresses } from '../users/Addresses';
import { Packages } from './Packages';
import { Orders } from '../Orders';
import { before } from 'node:test';
import { OrderedCustomization } from '../OrderedCustomization';

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

  @OneToOne(() => OrderedCustomization, (orderedCustomization) => orderedCustomization.OrdersPackages, { cascade: true, eager: true })
  @JoinColumn()
  OrderedCustomization: OrderedCustomization;

  @ManyToOne(() => Packages, (pkg) => pkg.OrdersPackages, { onDelete: 'CASCADE', eager: true })
  Package: Packages;


  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;



  @BeforeInsert()
  @BeforeUpdate()
  async calculateTotalPrice() {
    if (this.Package && this.Package.Price && this.quantity) {
      this.TotalPrice = (this.Package.Price) * this.quantity;
    }
  }



}
