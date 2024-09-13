import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm';
import { Resources } from '../Resources';
import { Offers } from '../Offers';
import { Reviews } from '../Reviews';
import { SubCategories } from '../categories/SubCategories';
import { ProductCustomizations } from './ProductCustomizations';
import { Brands } from '../Brands';

@Entity()
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  ProductID: number;

  @Column('varchar')
  Name: string;

  @Column('text')
  Description: string;

  @Column('decimal')
  Price: number;

  @Column('int')
  Quantity: number;

  @Column('text')
  Message: string;

  @Column('enum', {
    enum: ['None',
      'cotton', 'polyester', 'nylon', 'silk', 'wool', 'leather', 'rubber', 'linen',
      'denim', 'cashmere', 'velvet', 'satin', 'suede', 'tweed', 'corduroy', 'chiffon',
      'georgette', 'muslin', 'organza', 'taffeta', 'velour', 'velveteen', 'viscose',
      'acrylic', 'rayon', 'spandex', 'lycra', 'modal', 'bamboo', 'jute', 'hemp', 'ramie',
      'acetate', 'acrylic', 'lyocell', 'modacrylic', 'olefin', 'polypropylene', 'elastane',
    ], default: 'None'
  })
  Material: string;


  @OneToOne(() => Brands, (brand) => brand.BrandID)
  @JoinColumn({ name: 'BrandID' })
  Brand: Brands;


  @OneToMany(() => ProductCustomizations, (productCustomization) => productCustomization.ProductCustomizationID)
  @JoinColumn({ name: 'ProductCustomizationID' })
  ProductCustomization: ProductCustomizations[];

  @OneToMany(() => Resources, (resource) => resource.ResourceID)
  Resource: Resources[];

  @ManyToOne(() => Offers, (offer) => offer.OfferID)
  Offer: Offers;

  @OneToMany(() => Reviews, (review) => review.ReviewID)
  Review: Reviews[];

  @ManyToOne(() => SubCategories, (subcategory) => subcategory.SubCategoryID)
  SubCategory: SubCategories;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
