import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, BaseEntity, CreateDateColumn } from 'typeorm';
import { Brands } from '../Brands';
import { Offers } from '../Offers';
import { Resources } from '../Resources';
import { Reviews } from '../Reviews';
import { SubCategories } from '../categories/SubCategories';
import { ProductCustomizations } from './ProductCustomizations';
import { FavoriteProducts } from './FavoriteProducts';
import { Orders } from './OrdersProducts';

@Entity()
export class Products extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  ProductID: number;

  @Column('varchar')
  Name: string;

  @Column('text')
  Description: string;

  @Column('decimal')
  Price: number;

  @Column('int')
  Quantity: number;

  @Column('json', { nullable: true })
  Size: any;

  @Column('enum', { enum: ['out of stock', 'in stock', 'running low'], default: 'in stock' })
  Status: string;

  @Column('text')
  Message: string;

  @Column('enum', {
    enum: ['None', 'cotton', 'polyester', 'nylon', 'silk', 'wool', 'leather', 'rubber', 'linen', 'denim', 'cashmere', 'velvet', 'satin', 'suede', 'tweed', 'corduroy', 'chiffon', 'georgette', 'muslin', 'organza', 'taffeta', 'velour', 'velveteen', 'viscose', 'acrylic', 'rayon', 'spandex', 'lycra', 'modal', 'bamboo', 'jute', 'hemp', 'ramie', 'acetate', 'lyocell', 'modacrylic', 'olefin', 'polypropylene', 'elastane'],
    default: 'None'
  })
  Material: string;


  @ManyToOne(() => Brands, (brand) => brand.Products, { eager: true })
  Brand: Brands;

  @ManyToOne(() => SubCategories, (subcategory) => subcategory.Products, { eager: true })
  SubCategory: SubCategories;


  @ManyToOne(() => Offers, (offer) => offer.OfferID)
  Offer: Offers;

  @OneToMany(() => Resources, (resource) => resource.ResourceID)
  Resource: Resources[];

  // Many-to-many relationship with ProductCustomizations
  @ManyToMany(() => ProductCustomizations, (productCustomization) => productCustomization.Products)
  @JoinTable({
    name: 'ProductsCustomizations',  // Join table name
    joinColumn: {
      name: 'ProductID',
      referencedColumnName: 'ProductID'
    },
    inverseJoinColumn: {
      name: 'ProductCustomizationID',
      referencedColumnName: 'ProductCustomizationID'
    }
  })
  ProductCustomization: ProductCustomizations[];

  @ManyToMany(() => Reviews, (review) => review.Products)
  @JoinTable({
    name: 'ProductsReviews',  // Join table for reviews
    joinColumn: {
      name: 'ProductID',
      referencedColumnName: 'ProductID'
    },
    inverseJoinColumn: {
      name: 'ReviewID',
      referencedColumnName: 'ReviewID'
    }
  })
  Review: Reviews[];


  @OneToMany(() => FavoriteProducts, (favoriteProduct) => favoriteProduct.Product)
  FavoriteProduct: FavoriteProducts[];

  //FIX:
  @ManyToMany(() => Orders, (order) => order.Products)
  OrderProducts: Orders[];

  @CreateDateColumn()
  CreatedAt: Date;

  @CreateDateColumn()
  UpdatedAt: Date;
}
