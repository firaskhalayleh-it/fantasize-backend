import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { SubCategories } from './SubCategories';

@Entity()
export class Categories extends BaseEntity {
  @PrimaryGeneratedColumn()
  CategoryID: number;

  @Column('varchar',{unique:true})
  Name: string;

  @Column('bytea', { nullable: true })
  Image: Buffer;

  @Column('boolean', { default: true })
  IsActive: boolean;

  @OneToMany(() => SubCategories, (subCategory) => subCategory.Category)
  SubCategory: SubCategories[];
}
