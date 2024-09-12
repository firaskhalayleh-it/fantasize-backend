import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn, OneToMany } from 'typeorm';
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

    @OneToMany(() => Packages, (pkg) => pkg.PackageID)
    Package: Packages[];

    @CreateDateColumn()
    CreatedAt: Date;
}
