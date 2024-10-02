import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, BaseEntity, CreateDateColumn, Index, UpdateDateColumn, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import { Brands } from '../Brands';
import { Offers } from '../Offers';
import { Resources } from '../Resources';
import { Reviews } from '../Reviews';
import { SubCategories } from '../categories/SubCategories';
import { ProductCustomizations } from './ProductCustomizations';
import { FavoriteProducts } from './FavoriteProducts';
import { OrdersProducts } from './OrdersProducts';
import { Packages } from '../packages/Packages';
import { OrdersPackages } from '../packages/OrdersPackages';

@Entity()
export class Products extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  ProductID: number;

  @Column('varchar', { unique: true })
  Name: string;

  @Column('text')
  Description: string;

  @Column('decimal', { precision: 9, scale: 2, default: 0 })
  Price: number;

  @Column('int')
  Quantity: number;



  @Column('enum', { enum: ['out of stock', 'in stock', 'running low'], default: 'in stock' })
  Status: string;


  @Column('enum', {
    enum: ['None', 'cotton', 'polyester', 'nylon', 'silk', 'wool', 'leather', 'rubber', 'linen', 'denim', 'cashmere', 'velvet', 'satin', 'suede', 'tweed', 'corduroy', 'chiffon', 'georgette', 'muslin', 'organza', 'taffeta', 'velour', 'velveteen', 'viscose', 'acrylic', 'rayon', 'spandex', 'lycra', 'modal', 'bamboo', 'jute', 'hemp', 'ramie', 'acetate', 'lyocell', 'modacrylic', 'olefin', 'polypropylene', 'elastane'],
    default: 'None'
  })
  Material: string;


  @Column('int', { default: 0 })
  AvgRating: number;


  @ManyToOne(() => Brands, (brand) => brand.Products, )
  Brand: Brands;

  @ManyToOne(() => SubCategories, (subcategory) => subcategory.Products,)
  SubCategory: SubCategories;

  @ManyToOne(() => Packages, (pkg) => pkg.Product,)
  Package: Packages;

  @ManyToOne(() => Offers, (offer) => offer.OfferID)
  Offer: Offers;

  @OneToMany(() => Resources, (resource) => resource.ResourceID,)
  Resource: Resources[];

  @ManyToMany(() => ProductCustomizations, (productCustomization) => productCustomization.Products,)
  @JoinTable({
    name: 'ProductsCustomizations',
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

  @ManyToMany(() => Reviews, (review) => review.Products, { eager: true })
  @JoinTable({
    name: 'ProductsReviews',
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
  FavoriteProducts: FavoriteProducts[];

  @OneToMany(() => OrdersProducts, (orderProduct) => orderProduct.Product)
  OrdersProducts: OrdersProducts[];

  @OneToMany(() => OrdersPackages, (orderPackage) => orderPackage.Package)
  OrdersPackages: OrdersPackages[];

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;


  @BeforeInsert()
  @BeforeUpdate()
  checkStatus = () => {
    if (this.Quantity == 0) {
      this.Status = 'out of stock';
    } else if (this.Quantity < 10) {
      this.Status = 'running low';
    } else {
      this.Status = 'in stock';
    }
  }

  @AfterLoad()
  calculateAvgRating = () => {
    if (this.Review.length == 0) {
      this.AvgRating = 0;
    } else {
      const totalRating = this.Review.reduce((acc, review) => acc + review.Rating, 0);
      this.AvgRating = totalRating / this.Review.length;
    }
  }

}
