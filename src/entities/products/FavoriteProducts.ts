import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn, OneToMany, BaseEntity, UpdateDateColumn, OneToOne, PrimaryGeneratedColumn, Relation, JoinColumn, JoinTable } from 'typeorm';
import { Users } from '../users/Users';
import { Products } from './Products';

@Entity()
export class FavoriteProducts extends BaseEntity {
  @PrimaryGeneratedColumn()
  FavoriteProductID: number;

  @ManyToOne(() => Users, (user) => user.UserID,)
  User: Users;

  @ManyToOne(() => Products, (product) => product.FavoriteProducts)
  Product: Products;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
