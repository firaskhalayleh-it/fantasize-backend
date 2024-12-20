import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, JoinTable } from 'typeorm';
import { Users } from './users/Users';
import { Products } from './products/Products';
import { Packages } from './packages/Packages';

@Entity()
export class Reviews extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    ReviewID: number;

    @Column('int',{nullable: true})
    Rating: number;

    @Column('text', {nullable: true})
    Comment: string;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @ManyToMany(() => Products, (product) => product.Review)
    Products: Products[]; 

    @ManyToMany(()=> Packages, (pkg) => pkg.Reviews)
    @JoinTable()
    Packages: Packages[];


    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
}
