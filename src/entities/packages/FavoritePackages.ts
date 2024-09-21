import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/Users';
import { Packages } from '../packages/Packages';

@Entity()
export class FavoritePackages {
    @PrimaryGeneratedColumn('increment')
    favoritePackageID: number;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @ManyToOne(() => Packages, (pkg) => pkg.PackageID)
    Package: Packages;

    @CreateDateColumn()
    CreatedAt: Date;
}
