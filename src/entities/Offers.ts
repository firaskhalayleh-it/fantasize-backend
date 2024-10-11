import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
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

  @OneToMany(() => Products, (product) => product.Offer )
  Products: Products[];
  
  @OneToMany(() => Packages, (pkg) => pkg.Offer )
  Packages: Packages[];

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  ValidFrom: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  ValidTo: Date;
}
