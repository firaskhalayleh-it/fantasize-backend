import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';
import { Roles } from './Roles';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  UserID: number;

  @ManyToOne(() => Roles, (role) => role.RoleID)
  Role: Roles;

  @Column('varchar')
  Username: string;

  @Column('varchar')
  Email: string;

  @Column('varchar')
  Password: string;

  @Column('bytea')
  UserProfilePicture: Buffer;

  @Column('varchar')
  PhoneNumber: string;

  @Column('varchar')
  Gender: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}