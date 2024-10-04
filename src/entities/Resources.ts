import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne } from 'typeorm';
import { Products } from './products/Products';
import { Packages } from './packages/Packages';
import { Users } from './users/Users';

@Entity()
export class Resources extends BaseEntity{
  @PrimaryGeneratedColumn('increment')
  ResourceID: number;

  @Column()
    entityType: string; 

    @Column()
    entityName: string;

    @Column()
    fileType: string; 

    @Column()
    filePath: string; 

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  CreatedAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  UpdatedAt: Date;


  @OneToOne(()=> Users, (user) => user.UserProfilePicture)
  User: Users;
  
  @ManyToOne(() => Products, (product) => product.Resource)
  Product: Products;

  @ManyToOne(() => Packages, (pkg) => pkg.Resource)
  Package: Packages;


}
