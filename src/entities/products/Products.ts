import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    OneToMany
  } from 'typeorm';
  import { Resources } from '../Resources';
  import { Offers } from '../Offers';
  import { Reviews } from '../Reviews';
  import { SubCategories } from '../categories/SubCategories';
import { ProductCustomizations } from './ProductCustomizations';
  
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

    @OneToMany(()=> ProductCustomizations, (productCustomization) => productCustomization.ProductCustomizationID)
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
  