import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    ManyToMany
  } from 'typeorm';
  import { Packages } from './Packages';
import { Resources } from '../Resources';
  
  @Entity()
  export class PackageCustomizations extends BaseEntity{
    @PrimaryGeneratedColumn()
    PackageCustomizationID: number;
  
    @Column('jsonb', )
    Options: Record<string, any>;

    @ManyToMany(() => Packages, (pkg) => pkg.PackageCustomization)
    Packages: Packages[];
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  