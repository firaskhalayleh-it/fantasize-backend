import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
  } from 'typeorm';
import { CartProduct } from './products/CartProduct';
import { Users } from './users/Users';
import { CartPackage } from './packages/CartPackage';

  @Entity()
  export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    CartID: number;
  
    @ManyToOne(() => Users, (user) => user.Cart)
    User: Users;
  
    @OneToMany(() => CartProduct, (cartProduct) => cartProduct.Cart, { cascade: true })
    CartProducts: CartProduct[];
  
    @OneToMany(() => CartPackage, (cartPackage) => cartPackage.Cart, { cascade: true })
    CartPackages: CartPackage[];
  
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    TotalPrice: number;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  
    // Method to calculate the total price of the cart
    calculateTotalPrice() {
      let totalPrice = 0;
  
      // Calculate total price from cart products
      if (this.CartProducts && this.CartProducts.length > 0) {
        this.CartProducts.forEach((cartProduct) => {
          totalPrice += cartProduct.TotalPrice;
        });
      }
  
      // Calculate total price from cart packages
      if (this.CartPackages && this.CartPackages.length > 0) {
        this.CartPackages.forEach((cartPackage) => {
          totalPrice += cartPackage.TotalPrice;
        });
      }
  
      this.TotalPrice = totalPrice;
    }
  }
  