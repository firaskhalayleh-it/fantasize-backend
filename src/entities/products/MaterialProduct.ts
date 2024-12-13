// material product entity

import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Material } from '../Material';
import { Products } from './Products';

@Entity()
export class MaterialProduct extends BaseEntity {
    @PrimaryGeneratedColumn()
    MaterialProductID: number;

    @ManyToOne(() => Material, (material) => material.materialProduct)
    Material: Material;

    @ManyToOne(() => Products, (product) => product.MaterialProduct)
    Product: Products;

    @Column('int')
    percentage: number;
    
    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
}