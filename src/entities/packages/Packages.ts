import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Offers } from '../Offers';
import { Reviews } from '../Reviews';
import { Products } from '../products/Products';
import { PackageCustomizations } from './PackageCustomizations';

@Entity()
export class Packages extends BaseEntity {
  @PrimaryGeneratedColumn()
  PackageID: number;

  @Column('varchar')
  Name: string;

  @Column('text')
  Description: string;

  @Column('decimal')
  Price: number;

  @Column('varchar')
  Validity: string;

  @Column('int')
  Quantity: number;

  @Column('text')
  Message: string;

  @Column('json', { nullable: true })
  Size: any;  // change the interaction with this in controller

  @Column('enum', { enum: ['out of stock', 'in stock', 'running low'], default: 'in stock' })
  Status: string;

  @ManyToOne(() => Offers, (offer) => offer.OfferID)
  Offer: Offers;

  @OneToMany(() => PackageCustomizations, (customization) => customization.PackageCustomizationID)
  @JoinColumn({ name: 'PackageCustomizationID' })
  Customizations: PackageCustomizations[];

  @ManyToOne(() => Products, (product) => product.ProductID)
  Product: Products[];

  @ManyToMany(() => Reviews, (review) => review.ReviewID)
  @JoinTable({ name: 'PackagesReviews' })
  Review: Reviews[];

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
