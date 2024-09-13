import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn, OneToMany, BaseEntity } from 'typeorm';
import { Users } from '../users/Users';
import { Products } from './Products';

@Entity()
export class FavoriteProducts extends BaseEntity{
    @PrimaryColumn()
    UserID: number;

    @PrimaryColumn()
    ProductID: number;
    
  @ManyToOne(() => Users, (user) => user.UserID, )
  User: Users;

  @OneToMany(() => Products, (product) => product.ProductID)
  Product: Products[];  

  @CreateDateColumn()
  CreatedAt: Date;
}
