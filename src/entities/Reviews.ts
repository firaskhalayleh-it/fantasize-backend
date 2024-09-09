import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    BaseEntity
  } from 'typeorm';
  import { Users } from './users/Users';
  
  @Entity()
  export class Reviews extends BaseEntity{
    @PrimaryGeneratedColumn()
    ReviewID: number;
  
    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;
  
    @Column('int')
    Rating: number;
  
    @Column('text')
    Comment: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  }
  