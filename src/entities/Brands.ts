import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Products } from '../entities/products/Products';

@Entity()
export class Brands extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    BrandID: number;

    @Column('enum', {
        enum: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'ZARA', 'H&M', 'Levi Strauss & Co.', 'Gucci',
            'Prada', 'Chanel', 'Dior', 'Versace', 'Armani', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren',
            'Hugo Boss', 'Lacoste', 'Burberry', 'Fendi', 'Balenciaga', 'Givenchy', 'Valentino', 'Dolce & Gabbana',
            'Yves Saint Laurent', 'Alexander McQueen', 'Vetements', 'Off-White', 'Balmain', 'None'
        ],
        default: 'None'
    })
    Name: string;

    @OneToMany(() => Products, (product) => product.Brand)
    Products: Products[];
}
