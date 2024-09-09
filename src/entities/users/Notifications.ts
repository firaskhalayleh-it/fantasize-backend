import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  @Entity()
  export class Notifications {
    @PrimaryGeneratedColumn()
    NotificationID: number;
  
    @Column('varchar')
    Subject: string;
  
    @Column('text')
    Message: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  