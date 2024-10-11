import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Products } from './products/Products';
import { Packages } from './packages/Packages';
import { Users } from './users/Users';
import { Categories } from './categories/Categories';
import { join } from 'path';

@Entity()
export class Resources extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  ResourceID: number;


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

  @OneToOne(() => Categories, (category) => category.Image)
  @JoinColumn()
  Category: Categories;

  @OneToOne(() => Users, (user) => user.UserProfilePicture)
  @JoinColumn()
  User: Users;

  @ManyToOne(() => Products, (product) => product.Resource)
  Product: Products;

  @ManyToOne(() => Packages, (pkg) => pkg.Resource)
  Package: Packages;


}
