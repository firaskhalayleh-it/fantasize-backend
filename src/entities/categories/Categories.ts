import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubCategories } from './SubCategories';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  CategoryID: number;

  @Column('varchar')
  Name: string;

  @OneToMany(() => SubCategories, (subCategory) => subCategory.Category)
  SubCategory: SubCategories[];
}
