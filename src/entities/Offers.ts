import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Products } from './products/Products';
import { Packages } from './packages/Packages';

@Entity()
export class Offers extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OfferID: number;

  @Column('decimal')
  Discount: number;

  @Column('bool', { default: true })
  IsActive: boolean;

  @OneToMany(() => Products, (product) => product.ProductID)
  Products: Products[];

  @OneToMany(() => Packages, (pkg) => pkg.PackageID)
  Packages: Packages[];

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  ValidFrom: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  ValidTo: Date;
}
