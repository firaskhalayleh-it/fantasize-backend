import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn()
  RoleID: number;

  @Column('enum', { enum: ['user', 'admin'] })
  RoleName: string;
}
