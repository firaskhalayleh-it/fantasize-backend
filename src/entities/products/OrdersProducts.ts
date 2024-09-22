import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    BaseEntity
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

    @ManyToMany(() => Products, (product) => product.OrderProducts)
    @JoinTable()
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
  
    @CreateDateColumn()
    UpdatedAt: Date;
  }
  