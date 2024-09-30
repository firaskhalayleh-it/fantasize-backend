import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Packages } from './Packages';
import { Cart } from '../Cart';

@Entity()
export class CartPackage extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  CartPackageID: number;

  @ManyToOne(() => Cart, (cart) => cart.CartPackages)
  Cart: Cart;

  @ManyToOne(() => Packages, (pkg) => pkg.PackageID)
  Package: Packages;

  @Column('int')
  Quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  TotalPrice: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  calculateTotalPrice() {
    this.TotalPrice = this.Package.Price * this.Quantity;
  }
}
