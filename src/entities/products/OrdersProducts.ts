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
  import { Users } from '../users/Users';
  import { PaymentMethods } from '../users/PaymentMethods';
  import { Addresses } from '../users/Addresses';
import { Products } from './Products';
  
  @Entity()
  export class Orders extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    OrderID: number;
  
    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @OneToMany(() => Products, (products) => products.ProductID)
    Products: Products[];
  
    @Column('varchar')
    Status: string;
  
    @Column('boolean')
    IsGift: boolean;
  
    @Column('text')
    GiftMessage: string;
  
    @Column('boolean')
    IsAnonymous: boolean;
  
    @Column('decimal')
    TotalPrice: number;


  
    @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.PaymentMethodID)
    PaymentMethod: PaymentMethods;
  
    @ManyToOne(() => Addresses, (address) => address.AddressID)
    Address: Addresses;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  