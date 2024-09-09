import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { Users } from '../users/Users';
import { Products } from './Products';

@Entity()
export class FavoriteProducts {
    @PrimaryColumn()
    UserID: number;

    @PrimaryColumn()
    ProductID: number;
    
  @ManyToOne(() => Users, (user) => user.UserID, )
  User: Users;

  @ManyToOne(() => Products, (product) => product.ProductID)
  Product: Products;

  @CreateDateColumn()
  CreatedAt: Date;
}
