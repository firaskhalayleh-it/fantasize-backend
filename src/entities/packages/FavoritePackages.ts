import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Users } from '../users/Users';
import { Packages } from '../packages/Packages';

@Entity()
export class FavoritePackages extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    favoritePackageID: number;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @ManyToOne(() => Packages, (pkg) => pkg.PackageID, {eager:true})
    Package: Packages;

    @CreateDateColumn()
    CreatedAt: Date;
}
