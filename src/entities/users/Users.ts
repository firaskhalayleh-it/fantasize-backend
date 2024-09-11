import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Relation
} from 'typeorm';
import { Roles } from './Roles';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  UserID: string;

  @ManyToOne(() => Roles, (role) => role.RoleID)
  Role: Relation<Roles>;

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

  @Column('varchar2', { nullable: true })
  firebaseUID: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
