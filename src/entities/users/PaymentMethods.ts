import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany
  } from 'typeorm';
  import { Users } from './Users';
import { OrdersProduct } from '../products/OrdersProducts';
import { OrdersPackages } from '../packages/OrdersPackages';
  
  @Entity()
  export class PaymentMethods extends BaseEntity{
    @PrimaryGeneratedColumn()
    PaymentMethodID: number;
  
    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @OneToMany(() => OrdersProduct, (orderProduct) => orderProduct.OrderID)
    OrdersProduct: OrdersProduct[];

    @OneToMany(() => OrdersPackages, (orderPackage) => orderPackage.OrderID)
    OrdersPackages: OrdersPackages[];
  
    @Column('varchar')
    Method: string;
  
    @Column('varchar')
    CardholderName: string;
  
    @Column('date')
    ExpirationDate: Date;
  
    @Column('varchar')
    CardType: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  