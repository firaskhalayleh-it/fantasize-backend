import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity } from 'typeorm';
import { Products } from './Products';

@Entity()
export class ProductCustomizations extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    ProductCustomizationID: number;

    // size included in options 
    // color included in options
    // material included in options
    // attachment included in options
    // message included in options
    @Column('jsonb')
    Options: Record<string, any>;

    @ManyToMany(() => Products, (product) => product.ProductCustomization,{eager: true})
    Products: Products[];

}
