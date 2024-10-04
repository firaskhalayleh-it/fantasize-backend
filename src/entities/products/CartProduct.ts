import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Products } from './Products';
import { Cart } from '../Cart';

@Entity()
export class CartProduct extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  CartProductID: number;

  @ManyToOne(() => Cart, (cart) => cart.CartProducts)
  Cart: Cart;

  @ManyToOne(() => Products, (product) => product.ProductID)
  Product: Products;

  @Column('int')
  Quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  TotalPrice: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  calculateTotalPrice() {
    this.TotalPrice = this.Product.Price * this.Quantity;
  }
}
