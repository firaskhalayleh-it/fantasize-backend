import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, JoinColumn, BeforeInsert, AfterInsert, BeforeUpdate, AfterLoad } from 'typeorm';
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
  @BeforeInsert()
  @BeforeUpdate()
  checkOfferStatus() {
    this.updateIsActiveStatus();
  }

  @AfterLoad()
  async handleAfterLoad() {
    this.updateIsActiveStatus();
  }

  updateIsActiveStatus() {
    const currentDate = new Date();

    if (currentDate < this.ValidFrom) {
      this.IsActive = false;
    } else if (currentDate >= this.ValidFrom && currentDate <= this.ValidTo) {
      this.IsActive = true;
    } else {
      this.IsActive = false;
    }
  }
}
