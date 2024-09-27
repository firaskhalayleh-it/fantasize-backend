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
import { Packages } from './Packages';

@Entity()
export class OrdersPackages extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OrderID: number;

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

  @ManyToOne(() => Users, (user) => user.UserID)
  User: Users;

  @ManyToMany(() => Packages, (packages) => packages.PackageID)
  @JoinTable({
    name: 'OrdersPackages',
    joinColumn: {
      name: 'OrderID',
      referencedColumnName: 'OrderID'
    },
    inverseJoinColumn: {
      name: 'PackageID',
      referencedColumnName: 'PackageID'
    }
  })
  Packages: Packages[];

  @ManyToOne(() => PaymentMethods, (paymentMethod) => paymentMethod.PaymentMethodID)
  PaymentMethod: PaymentMethods;

  @ManyToOne(() => Addresses, (address) => address.AddressID)
  Address: Addresses;


  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
