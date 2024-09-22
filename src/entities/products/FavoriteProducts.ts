import { Entity, ManyToOne, CreateDateColumn, PrimaryGeneratedColumn, OneToMany, BaseEntity } from 'typeorm';
import { Users } from '../users/Users';
import { Products } from './Products';

@Entity()
export class FavoriteProducts extends BaseEntity{
  @PrimaryGeneratedColumn()
  FavoriteProductID: number;

  @ManyToOne(() => Users, (user) => user.UserID, )
  User: Users;

  @ManyToOne(() => Products, (product) => product.FavoriteProduct)
  Product: Products;

  @CreateDateColumn()
  CreatedAt: Date;
}
