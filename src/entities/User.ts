
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm';
import { Role } from '../../src/entities/Role';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  userID: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'bytea', nullable: true })
  userProfilePicture: Buffer;


  @Column()
  phoneNumber: string;

  @Column()
  gender: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
