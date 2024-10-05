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

  @Column('varchar')
  type: 'email' | 'push'; 

  @Column('jsonb')
  template: any;  

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column('varchar', { nullable: true })
  deliveryMethod: 'smtp' | 'push'; 

  @Column('boolean', { default: false })
  sent: boolean; 

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
