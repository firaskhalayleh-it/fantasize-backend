import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from 'typeorm';
import { Categories } from './Categories';
import { Products } from '../products/Products';
import { Packages } from '../packages/Packages';

@Entity()
export class SubCategories extends BaseEntity {
  @PrimaryGeneratedColumn()
  SubCategoryID: number;

  @Column('varchar')
  Name: string;

  @Column('boolean', { default: true })
  IsActive: boolean;

  @ManyToOne(() => Categories, (category) => category.SubCategory)
  Category: Categories;

  @OneToMany(() => Products, (product) => product.SubCategory)
  Products: Products[];

  @OneToMany(() => Packages, (pkg) => pkg.SubCategory)
  Package: Packages[];
}
