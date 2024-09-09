import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Categories } from './Categories';

@Entity()
export class SubCategories extends BaseEntity{
  @PrimaryGeneratedColumn()
  SubCategoryID: number;

  @ManyToOne(() => Categories, (category) => category.CategoryID)
  Category: Categories;

  @Column('varchar')
  Name: string;
}
