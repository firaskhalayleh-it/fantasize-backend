// Material entity 
//
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Products } from './products/Products';
import { Packages } from './packages/Packages';
import { MaterialProduct } from './products/MaterialProduct';
import { MaterialPackage } from './packages/MaterialPackage';

@Entity()
export class Material extends BaseEntity {
    @PrimaryGeneratedColumn()
    MaterialID: number;

    @Column('varchar', { unique: true })
    Name: string;

    @OneToMany(() => MaterialProduct, (materialProduct) => materialProduct.Material)
    materialProduct: MaterialProduct[];

    @OneToMany(() => MaterialPackage, (materialPackage) => materialPackage.Material)
    materialPackage: MaterialPackage[];


    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;


}
