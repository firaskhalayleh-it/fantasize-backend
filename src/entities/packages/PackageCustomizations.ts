import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
  } from 'typeorm';
  import { Packages } from './Packages';
  
  @Entity()
  export class PackageCustomizations extends BaseEntity{
    @PrimaryGeneratedColumn()
    PackageCustomizationID: number;
  
    @ManyToOne(() => Packages, (pkg) => pkg.PackageID)
    Package: Packages;
  
    @Column('text')
    Options: string;
  
    @Column('text')
    Description: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  