import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brands extends BaseEntity {
    @PrimaryGeneratedColumn()
    BrandID: number;


    @Column('enum', {
        enum: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'ZARA', 'H&M', 'Levi Strauss & Co.', 'Gucci',
            'Prada', 'Chanel', 'Dior', 'Versace', 'Armani', 'Calvin Klein', 'Tommy Hilfiger', 'Ralph Lauren',
            'Hugo Boss', 'Lacoste', 'Burberry', 'Fendi', 'Balenciaga', 'Givenchy', 'Valentino', 'Dolce & Gabbana',
            'Yves Saint Laurent', 'Alexander McQueen', 'Vetements', 'Off-White', 'Balmain','None'
        ],
        default: 'None'
    })
    Name: string;
}