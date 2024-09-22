import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
  } from 'typeorm';

  @Entity()
  export class Notifications extends BaseEntity {
    @PrimaryGeneratedColumn()
    NotificationID: number;

    @Column('varchar')
    Subject: string;

    @Column('text')
    Message: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @CreateDateColumn()
    UpdatedAt: Date;
  }
