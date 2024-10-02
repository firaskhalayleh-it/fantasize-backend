import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany
} from 'typeorm';
import { Users } from './Users';
import { Orders } from '../Orders';

@Entity()
export class Addresses extends BaseEntity {
  @PrimaryGeneratedColumn()
  AddressID: number;

  @ManyToOne(() => Users, (user) => user.UserID)
  User: Users;

  @OneToMany(() => Orders, (order) => order.Address)
  Orders: Orders[];


  @Column('varchar')
  AddressLine: string;

  @Column('varchar')
  City: string;

  @Column('varchar')
  State: string;

  @Column('varchar')
  Country: string;

  @Column('varchar')
  PostalCode: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @CreateDateColumn()
  UpdatedAt: Date;
}
