import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, JoinColumn } from 'typeorm';
import { SubCategories } from './SubCategories';
import { join } from 'path';

@Entity()
export class Categories extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  CategoryID: number;

  @Column('varchar', { unique: true })
  Name: string;

  @Column('varchar', { nullable: true })
  Image: string;

  @Column('boolean', { default: true })
  IsActive: boolean;

  @OneToMany(() => SubCategories, (subCategory) => subCategory.Category)
  SubCategory: SubCategories[];

}
