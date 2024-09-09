import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Packages } from './packages/Packages';
import { Products } from './products/Products';

@Entity()
export class PackageProduct extends BaseEntity {
    @PrimaryColumn()
    PackageID: number;

    @PrimaryColumn()
    ProductID: number;
  @ManyToOne(() => Packages, (pkg) => pkg.PackageID, )

  Package: Packages;

  @ManyToOne(() => Products, (product) => product.ProductID, )
  
  Product: Products;
}
