import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, BaseEntity } from 'typeorm';
import { Users } from './users/Users';
import { Products } from './products/Products';
import { Packages } from './packages/Packages';

@Entity()
export class Reviews extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    ReviewID: number;

    @Column('int')
    Rating: number;

    @Column('text')
    Comment: string;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @ManyToMany(() => Products, (product) => product.Review)
    Products: Products[]; 

    @ManyToMany(()=> Packages, (pkg) => pkg.Reviews)
    Packages: Packages[];
}
