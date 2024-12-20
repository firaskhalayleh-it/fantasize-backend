// src/entities/products/OrdersProducts.ts

import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Products } from "./products/Products";
import { Packages } from "./packages/Packages";

@Entity({ name: 'Customization' })
export class Customization extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  CustomizationID: number;

  @ManyToMany(() => Products, (product) => product.Customization)
  Product: Products[];

  @ManyToMany(() => Packages, (pkg) => pkg.Customization)
  Packages: Packages[];

  @Column('jsonb', { nullable: true })
  option: {
    name: string;
    type: string;
    optionValues: {
      name: string;
      value: string;
      isSelected: boolean;
      filePath?: string;
    }[];
  };


  @CreateDateColumn()
  CreatedAt: Date;


  @UpdateDateColumn()
  UpdatedAt: Date;


}
