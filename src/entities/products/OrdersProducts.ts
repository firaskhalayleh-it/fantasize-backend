import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Users } from '../users/Users';
import { PaymentMethods } from '../users/PaymentMethods';
import { Addresses } from '../users/Addresses';
import { Products } from './Products';
import { join } from 'path';

@Entity()
export class OrdersProduct extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OrderID: number;

  @ManyToOne(() => Users, (user) => user.UserID)
  User: Users;

  @ManyToMany(() => Products, (products) => products.ProductID)
  @JoinTable(
    {
      name: 'OrdersProducts',
      joinColumn: {
        name: 'OrderID',
        referencedColumnName: 'OrderID'
      },
      inverseJoinColumn: {
        name: 'ProductID',
        referencedColumnName: 'ProductID'
      }

    }

  )
  Products: Products[];

  @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.PaymentMethodID)
  PaymentMethod: PaymentMethods;

  @ManyToOne(() => Addresses, (address) => address.AddressID)
  Address: Addresses;


  @Column('boolean', { default: false }) // complete and incomplete order
  Status: boolean;

  @Column('boolean')
  IsGift: boolean;

  @Column('text')
  GiftMessage: string;

  @Column('boolean')
  IsAnonymous: boolean;

  @Column('decimal')
  TotalPrice: number;





  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
