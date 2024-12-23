import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, JoinColumn, Index } from 'typeorm';
import { Categories } from './Categories';
import { Products } from '../products/Products';
import { Packages } from '../packages/Packages';

@Entity()
export class SubCategories extends BaseEntity {
  @PrimaryGeneratedColumn()
  SubCategoryID: number;

  @Column('varchar',)
  @Index()
  Name: string;

  @Column('boolean', { default: true })
  IsActive: boolean;

  @ManyToOne(() => Categories, (category) => category.SubCategory)
  @JoinColumn({ name: "CategoryID" }) 
  Category: Categories;

  @OneToMany(() => Products, (product) => product.SubCategory,{onDelete: 'CASCADE'})
  Products: Products[];

  @OneToMany(() => Packages, (pkg) => pkg.SubCategory,{onDelete: 'CASCADE'})  
  Package: Packages[];
}
