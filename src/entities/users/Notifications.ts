import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn
} from 'typeorm';
import { Users } from './Users';

@Entity()
export class Notifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  notificationID: number;

  @ManyToOne(() => Users, (user) => user.notifications)
  user: Users;

  @Column('jsonb')
  template: any;

  @Column('varchar')
  subject: string;

  @Column('boolean', { default: false })
  sent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
