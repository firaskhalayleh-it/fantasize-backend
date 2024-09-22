import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
  Relation,
  OneToOne,
  OneToMany
} from 'typeorm';
import { Roles } from './Roles';
import { FavoriteProducts } from '../products/FavoriteProducts';
import { FavoritePackages } from '../packages/FavoritePackages';
import { PaymentMethods } from './PaymentMethods';
import { Addresses } from './Addresses';
import { Reviews } from '../Reviews';
import { OrdersProduct } from '../products/OrdersProducts';
import { OrdersPackages } from '../packages/OrdersPackages';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  UserID: string;

  @ManyToOne(() => Roles, (role) => role.RoleID)
  Role: Relation<Roles>;

  @Column('varchar')
  Username: string;

  @Column('varchar')
  Email: string;

  @Column('varchar')
  Password: string;

  @Column('bytea', { nullable: true })
  UserProfilePicture: Buffer;

  @Column('varchar', { nullable: true })
  PhoneNumber: string;

  @Column('varchar', { nullable: true })
  Gender: string;

  @OneToMany(() => FavoriteProducts, (favoriteProduct) => favoriteProduct.User)
  FavoriteProducts: FavoriteProducts[];

  @OneToMany(() => FavoritePackages, (favoritePackages) => favoritePackages.User)
  FavoritePackages: FavoritePackages[];


  @OneToMany(() => PaymentMethods, (paymentMethod) => paymentMethod.User)
  PaymentMethods: PaymentMethods[];

  @OneToMany(() => Addresses, (address) => address.User)
  Addresses: Addresses[];

  @OneToMany(() => Reviews, (review) => review.User)
  Reviews: Reviews[];

  @OneToMany(() => OrdersProduct, (order) => order.User)
  Orders: OrdersProduct[];

  @OneToMany(() => OrdersPackages, (order) => order.User)
  OrdersPackages: OrdersPackages[];





  @Column('varchar', { nullable: true })
  firebaseUID: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @CreateDateColumn()
  UpdatedAt: Date;


  toJSON() {
    const { Password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
