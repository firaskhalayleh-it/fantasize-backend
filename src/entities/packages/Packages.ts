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
  export class Packages extends BaseEntity{
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
  
    @ManyToOne(() => Offers, (offer) => offer.OfferID)
    Offer: Offers;

    @OneToMany(() => PackageCustomizations, (customization) => customization.PackageCustomizationID)
    @JoinColumn({name: 'PackageCustomizationID'})  
    Customizations: PackageCustomizations[];
    
    @ManyToOne(() => Products, (product) => product.ProductID)
    Product: Products[];
  
    @ManyToOne(() => Reviews, (review) => review.ReviewID)
    Review: Reviews;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  