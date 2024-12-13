import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, BaseEntity, CreateDateColumn, Index, UpdateDateColumn, BeforeInsert, BeforeUpdate, AfterLoad, JoinColumn } from 'typeorm';
import { Brands } from '../Brands';
import { Offers } from '../Offers';
import { Resources } from '../Resources';
import { Reviews } from '../Reviews';
import { SubCategories } from '../categories/SubCategories';
import { FavoriteProducts } from './FavoriteProducts';
import { OrdersProducts } from './OrdersProducts';
import { PackageProduct } from '../packages/packageProduct';
import { Customization } from '../Customization';
import { MaterialProduct } from './MaterialProduct';

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


  @OneToMany(() => MaterialProduct, (materialProduct) => materialProduct.Product)
  MaterialProduct: MaterialProduct[];

  @Column('decimal', { precision: 9, scale: 2, default: 0 })
  DiscountPrice: number

  @Column('int', { default: 0 })
  AvgRating: number;


  @ManyToOne(() => Brands, (brand) => brand.Products,)
  Brand: Brands;

  @ManyToOne(() => SubCategories, (subcategory) => subcategory.Products,)
  SubCategory: SubCategories;

  // @ManyToOne(() => Packages, (pkg) => pkg.Product,)
  // Package: Packages;
  @OneToMany(() => PackageProduct, (packageProduct) => packageProduct.Product)
  PackageProduct: PackageProduct[];

  @ManyToOne(() => Offers, (offer) => offer.Products,)
  Offer: Offers;

  @OneToMany(() => Resources, (resource) => resource.Product, { eager: true })
  Resource: Resources[];

  @ManyToMany(() => Customization, (customization) => customization.Product, { eager: true })
  @JoinTable({
    name: 'ProductsCustomization',
    joinColumn: {
      name: 'ProductID',
      referencedColumnName: 'ProductID'
    },
    inverseJoinColumn: {
      name: 'CustomizationID',
      referencedColumnName: 'CustomizationID'
    }
  })
  Customization: Customization[];

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

  @BeforeInsert()
  @BeforeUpdate()
  updateDiscountPrice = () => {
    this.DisPrice();
  }

  @AfterLoad()
  calculateAvgRating = () => {
    if (!Array.isArray(this.Review) || this.Review.length === 0) {
      this.AvgRating = 0;
    } else {
      const totalRating = this.Review.reduce((acc, review) => acc + review.Rating, 0);
      this.AvgRating = totalRating / this.Review.length;
    }
  }

  @AfterLoad()
  checkDiscountPrice = () => {
    this.DisPrice();
  }


  DisPrice = () => {
    if (this.Offer && this.Offer.IsActive) {
      this.DiscountPrice = this.Price - (this.Price * this.Offer.Discount / 100);
    } else {
      this.DiscountPrice = 0;
    }
  }


  toJSON() {
    if (this.DiscountPrice === 0) {
      const { DiscountPrice, ...returnWithoutDisPrice } = this;
      return returnWithoutDisPrice;
    } else {
      return this;
    }
  }
}
