import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { User } from './User';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  roleID: number;

  @Column()
  roleName: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
