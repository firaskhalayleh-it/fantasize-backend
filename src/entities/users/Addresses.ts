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
import { OrdersPackages } from '../packages/OrdersPackages';
import { OrdersProduct } from '../products/OrdersProducts';
  
  @Entity()
  export class Addresses extends BaseEntity {
    @PrimaryGeneratedColumn()
    AddressID: number;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;


    @OneToMany(()=> OrdersPackages, (order) => order.OrderID)
    Orders: OrdersPackages[];

    @OneToMany(() => OrdersProduct, (order) => order.OrderID)
    OrdersProduct: OrdersProduct[];
  
    @Column('varchar')
    AddressLine: string;

    @Column('varchar')
    City: string;
  
    @Column('varchar')
    State: string;
  
    @Column('varchar')
    Country: string;
  
    @Column('varchar')
    PostalCode: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @CreateDateColumn()
    UpdatedAt: Date;
  }
  