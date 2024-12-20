// material package entity
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Material } from '../Material';
import { Packages } from './Packages';
@Entity()
export class MaterialPackage extends BaseEntity {
    @PrimaryGeneratedColumn()
    MaterialPackageID: number;

    @ManyToOne(() => Material, (material) => material.materialPackage)
    Material: Material;

    @ManyToOne(() => Packages, (pkg) => pkg.MaterialPackage)
    Package: Packages;

    @Column('int')
    percentage: number;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
}