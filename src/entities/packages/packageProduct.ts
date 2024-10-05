import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Packages } from './Packages';
import { Products } from '../products/Products';


@Entity()
export class PackageProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  PackageProductId: number;

  @Column('varchar')
  ProductName:string
    
  @Column('int')
  Quantity: number;

  @ManyToOne(() => Packages, (pkg) => pkg.PackageProduct, { onDelete: 'CASCADE' })
  Package: Packages;

  @ManyToOne(() => Products, (product) => product.PackageProduct, { onDelete: 'CASCADE' })
  Product: Products;
}
