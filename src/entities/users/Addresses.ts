import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  import { Users } from './Users';
  
  @Entity()
  export class Addresses {
    @PrimaryGeneratedColumn()
    AddressID: number;
  
    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;
  
    @Column('varchar')
    AddressLine: string;
  
    @Column('varchar')
    City: string;
  
    @Column('varchar')
    State: string;
  
    @Column('varchar')
    Country: string;
  
    @Column('varchar')
    PostalCode: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  