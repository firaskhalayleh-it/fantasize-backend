import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { Categories } from './Categories';
import { Products } from '../products/Products';

@Entity()
export class SubCategories extends BaseEntity {
  @PrimaryGeneratedColumn()
  SubCategoryID: number;

  @Column('varchar')
  Name: string;

  // Many SubCategories can belong to one Category
  @ManyToOne(() => Categories, (category) => category.SubCategory)
  Category: Categories;

  // One SubCategory can have many Products
  @OneToMany(() => Products, (product) => product.SubCategory)
  Products: Products[];
}
