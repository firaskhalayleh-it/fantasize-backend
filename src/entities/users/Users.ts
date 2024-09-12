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

  @Column('bytea', { nullable: true })
  UserProfilePicture: Buffer;

  @Column('varchar', { nullable: true })
  PhoneNumber: string;

  @Column('varchar', { nullable: true })
  Gender: string;

  @Column('varchar', { nullable: true })
  firebaseUID: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;


  toJSON() {
    const { Password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
