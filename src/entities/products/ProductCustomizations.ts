import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity } from 'typeorm';
import { Products } from './Products';

@Entity()
export class ProductCustomizations extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    ProductCustomizationID: number;

    @Column('varchar')
    OptionName: string;

    @Column('varchar')
    OptionValue: string;

    // Many-to-many relationship with Products
    @ManyToMany(() => Products, (product) => product.ProductCustomization)
    Products: Products[];
}
  