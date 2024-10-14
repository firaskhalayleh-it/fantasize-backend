import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
  Relation,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad
} from 'typeorm';
import { Offers } from '../Offers';
import { Reviews } from '../Reviews';
import { Products } from '../products/Products';
import { SubCategories } from '../categories/SubCategories';
import { Resources } from '../Resources';
import { FavoritePackages } from './FavoritePackages';
import { OrdersPackages } from './OrdersPackages';
import { PackageProduct } from './packageProduct';
import { Customization } from '../Customization';
@Entity()

export class Packages extends BaseEntity {
  @PrimaryGeneratedColumn()
  PackageID: number;

  @Column('varchar', { unique: true })
  Name: string;

  @Column('text')
  Description: string;

  @Column('decimal')
  Price: number;


  @Column('int')
  Quantity: number;



  @Column('enum', { enum: ['out of stock', 'in stock', 'running low'], default: 'in stock' })
  Status: string;

  @ManyToOne(() => Offers, (offer) => offer.Packages)
  Offer: Offers;

  @OneToMany(() => OrdersPackages, (orderPackage) => orderPackage.Package,)
  OrdersPackages: OrdersPackages[];

  @ManyToOne(() => SubCategories, (subcategory) => subcategory.Package, { eager: true })
  SubCategory: SubCategories;


  @Column('int', { default: 0 })
  AvgRating: number;



  @OneToMany(() => Resources, (resource) => resource.Package, { eager: true })
  @JoinColumn()
  Resource: Resources[];

  // @OneToMany(() => Products, (product) => product.Package)
  // Product: Products[];
  @OneToMany(() => PackageProduct, (packageProduct) => packageProduct.Package)
  PackageProduct: PackageProduct[];

  @ManyToMany(() => Customization, (pkgCustom) => pkgCustom.Packages, { eager: true })
  @JoinTable({
    name: 'PackagesCustomization',
    joinColumn: {
      name: 'PackageID',
      referencedColumnName: 'PackageID'
    },
    inverseJoinColumn: {
      name: 'CustomizationID',
      referencedColumnName: 'CustomizationID'
    }
  })
  Customization: Customization[];


  @OneToMany(() => FavoritePackages, (favoritePackages) => favoritePackages.Package)
  FavoritePackages: FavoritePackages[];

  @ManyToMany(() => Reviews, (review) => review.Packages)
  @JoinTable({
    name: 'PackagesReviews',
    joinColumn: {
      name: 'PackageID',
      referencedColumnName: 'PackageID'
    },
    inverseJoinColumn: {
      name: 'ReviewID',
      referencedColumnName: 'ReviewID'
    }
  })
  Reviews: Reviews[];
  

  CreatedAt: Date;

  @CreateDateColumn()
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
  calculateAvgRating() {
    // Check if the ratings array exists and has items
    if (this.Reviews && this.Reviews.length > 0) {
      const totalRating = this.Reviews.reduce((sum, review) => sum + review.Rating, 0);
      this.AvgRating = totalRating / this.Reviews.length;
    } else {
      this.AvgRating = 0; // Or any default value
    }
  }

}
