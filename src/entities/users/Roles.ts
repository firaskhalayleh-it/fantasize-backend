import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn()
  RoleID: number;

  @Column('varchar')
  RoleName: string;
}
