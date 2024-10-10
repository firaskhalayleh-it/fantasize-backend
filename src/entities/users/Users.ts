import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
  Relation,
  OneToOne,
  OneToMany,
  Index,
  JoinColumn
} from 'typeorm';
import { Roles } from './Roles';
import { FavoriteProducts } from '../products/FavoriteProducts';
import { FavoritePackages } from '../packages/FavoritePackages';
import { PaymentMethods } from './PaymentMethods';
import { Addresses } from './Addresses';
import { Reviews } from '../Reviews';
import { Orders } from '../Orders';
import { Resources } from '../Resources';
import { Notifications } from './Notifications';
import { join } from 'path';

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

  @Column('varchar', { nullable: true })
  dateofbirth: string;

  @Column('varchar', { nullable: true })
  DeviceToken: string;

  
  @Column('varchar', { nullable: true })
  @Index()
  resetPasswordToken: string; 

  @Column('timestamp', { nullable: true })
  resetPasswordExpires: Date;  

  @Column('varchar', { nullable: true })
  FirebaseToken: string;
  
  @Column('varchar', { nullable: true, unique: true })
  PhoneNumber: string;

  @Column('timestamp', { nullable: true })
  lastlogin: Date;
  
  @Column('varchar', { nullable: true })
  Gender: string;

  @OneToOne(() => Resources, (resource) => resource.User,{nullable:true})
  @JoinColumn()
  UserProfilePicture: Resources;
  
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

  @OneToMany(() => Notifications, (notification) => notification.user)
  notifications: Notifications[];



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
