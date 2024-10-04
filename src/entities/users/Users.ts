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
import { OrdersProducts } from '../products/OrdersProducts';
import { OrdersPackages } from '../packages/OrdersPackages';
import { Cart } from '../Cart';
import { Orders } from '../Orders';
import { Resources } from '../Resources';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  UserID: string;

  @ManyToOne(() => Roles, (role) => role.RoleID)
  Role: Relation<Roles>;

  @Column('varchar', { unique: true })
  Username: string;

  @Column('varchar', { unique: true })
  Email: string;

  @Column('varchar')
  Password: string;

  @OneToOne(() =>Resources, (resource) => resource.ResourceID)
  UserProfilePicture: string;

  @Column('varchar', { nullable: true, unique: true })
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

  @OneToMany(() => Orders, (order) => order.User)
  Orders: Orders[];



  @OneToMany(() => Cart, (cart) => cart.User)
  Cart: Cart[];

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
