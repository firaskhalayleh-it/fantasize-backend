import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, Index } from "typeorm";
import { Products } from '../entities/products/Products';


@Entity()
export class Brands extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    BrandID: number;

    @Column('varchar', { unique: true })
    @Index()
    Name: string;

    @OneToMany(() => Products, (product) => product.Brand)
    Products: Products[];
}

