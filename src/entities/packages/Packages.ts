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
  Relation
} from 'typeorm';
import { Offers } from '../Offers';
import { Reviews } from '../Reviews';
import { Products } from '../products/Products';
import { PackageCustomizations } from './PackageCustomizations';
import { SubCategories } from '../categories/SubCategories';
import { Resources } from '../Resources';
import { FavoritePackages } from './FavoritePackages';
import { OrdersPackages } from './OrdersPackages';
import { PackageProduct } from './packageProduct';

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

  @ManyToOne(() => Offers, (offer) => offer.OfferID)
  Offer: Offers;

  @OneToMany(() => OrdersPackages, (orderPackage) => orderPackage.Package)
  OrdersPackages: OrdersPackages[];
  
  @ManyToOne(() => SubCategories, (subcategory) => subcategory.Package, { eager: true })
  SubCategory: SubCategories;

  

  @OneToMany(() => Resources, (resource) => resource.Package)
  Resource: Resources[];

  // @OneToMany(() => Products, (product) => product.Package)
  // Product: Products[];
  @OneToMany(() => PackageProduct, (packageProduct) => packageProduct.Package)
  PackageProduct: PackageProduct[];

  @OneToMany(() => PackageCustomizations, (packageCustomization) => packageCustomization.Packages)
  PackageCustomization: PackageCustomizations[];


  @OneToMany(()=>FavoritePackages, (favoritePackages)=>favoritePackages.Package)
  FavoritePackages: FavoritePackages[];

  @ManyToMany(() => Reviews, (review) => review.Products)
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
  Review: Reviews[];

  CreatedAt: Date;

  @CreateDateColumn()
  UpdatedAt: Date;
}
