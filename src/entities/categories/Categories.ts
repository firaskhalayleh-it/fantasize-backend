import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { SubCategories } from './SubCategories';

@Entity()
export class Categories extends BaseEntity {
  @PrimaryGeneratedColumn()
  CategoryID: number;

  @Column('varchar')
  Name: string;

  @Column('boolean', { default: true })
  IsActive: boolean;

  @OneToMany(() => SubCategories, (subCategory) => subCategory.Category)
  SubCategory: SubCategories[];
}
