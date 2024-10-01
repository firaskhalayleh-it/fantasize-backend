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
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { Offers } from '../Offers';
import { Reviews } from '../Reviews';
import { Products } from '../products/Products';
import { PackageCustomizations } from './PackageCustomizations';
import { SubCategories } from '../categories/SubCategories';
import { Resources } from '../Resources';
import { FavoritePackages } from './FavoritePackages';

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

  @Column('varchar')
  Validity: string;

  @Column('int')
  Quantity: number;

  @Column('text')
  Message: string;

  @Column('json', { nullable: true })
  Size: any;  

  @Column('enum', { enum: ['out of stock', 'in stock', 'running low'], default: 'in stock' })
  Status: string;

  @ManyToOne(() => Offers, (offer) => offer.OfferID)
  Offer: Offers;

  @ManyToOne(() => SubCategories, (subcategory) => subcategory.Package, { eager: true })
  SubCategory: SubCategories;

  @ManyToMany(() => PackageCustomizations, (packageCustomizations) => packageCustomizations.PackageCustomizationID)
  @JoinTable({
    name: 'PackagesCustomizations',  
    joinColumn: {
      name: 'PackageID',
      referencedColumnName: 'PackageID'
    },
    inverseJoinColumn: {
      name: 'PackageCustomizationID',
      referencedColumnName: 'PackageCustomizationID'
    }
  })
  PackageCustomization: PackageCustomizations[];



  @OneToMany(() => Resources, (resource) => resource.ResourceID)
  Resource: Resources[];

  @OneToMany(() => Products, (product) => product.ProductID)
  Product: Products[];


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

  @CreateDateColumn()
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

  
}
