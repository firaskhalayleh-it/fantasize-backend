import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Products } from './products/Products';
import { Packages } from './packages/Packages';

@Entity()
export class Resources extends BaseEntity{
  @PrimaryGeneratedColumn('increment')
  ResourceID: number;

  @Column('varchar')
  AttachmentPath: string;

  @ManyToOne(() => Products, (product) => product.Resource)
  Product: Products;

  @ManyToOne(() => Packages, (pkg) => pkg.Resource)
  Package: Packages;
}
