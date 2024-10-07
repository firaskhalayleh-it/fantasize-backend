import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, JoinColumn, Index, OneToOne } from 'typeorm';
import { SubCategories } from './SubCategories';
import { join } from 'path';
import { Resources } from '../Resources';

@Entity()
export class Categories extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  CategoryID: number;

  @Column('varchar', { unique: true })
  @Index()
  Name: string;

  @OneToOne(() => Resources, (resource) => resource.Category)
  Image: Resources;

  @Column('boolean', { default: true })
  IsActive: boolean;

  @OneToMany(() => SubCategories, (subCategory) => subCategory.Category)
  SubCategory: SubCategories[];

}
