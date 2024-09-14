import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, BaseEntity } from 'typeorm';
import { Products } from './Products';

@Entity()
export class ProductCustomizations extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    ProductCustomizationID: number;

    @Column('jsonb', )
    Options: Record<string, any>;

    @ManyToMany(() => Products, (product) => product.ProductCustomization)
    Products: Products[];
}
  