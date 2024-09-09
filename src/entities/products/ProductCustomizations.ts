import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
  } from 'typeorm';
  import { Products } from './Products';
  
  @Entity()
  export class ProductCustomizations extends BaseEntity{
    @PrimaryGeneratedColumn()
    ProductCustomizationID: number;
  
    @ManyToOne(() => Products, (product) => product.ProductID)
    Product: Products;
  
    @Column('text')
    Options: string;
  
    @Column('text')
    Description: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  