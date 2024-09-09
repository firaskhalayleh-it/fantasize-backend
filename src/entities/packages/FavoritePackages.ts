import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { Users } from '../users/Users';
import { Packages } from '../packages/Packages';

@Entity()
export class FavoritePackages {
    @PrimaryColumn()
    UserID: number;

    @PrimaryColumn()
    PackageID: number;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @ManyToOne(() => Packages, (pkg) => pkg.PackageID)
    Package: Packages;

    @CreateDateColumn()
    CreatedAt: Date;
}
