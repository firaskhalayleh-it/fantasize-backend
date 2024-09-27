import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, JoinColumn, Index } from 'typeorm';
import { SubCategories } from './SubCategories';
import { join } from 'path';

@Entity()
export class Categories extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  CategoryID: number;

  @Column('varchar', { unique: true })
  @Index()
  Name: string;

  @Column('varchar', { nullable: true })
  Image: string;

  @Column('boolean', { default: true })
  IsActive: boolean;

  @OneToMany(() => SubCategories, (subCategory) => subCategory.Category)
  SubCategory: SubCategories[];

}
