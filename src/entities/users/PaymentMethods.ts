import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
  } from 'typeorm';
  import { Users } from './Users';
  
  @Entity()
  export class PaymentMethods extends BaseEntity{
    @PrimaryGeneratedColumn()
    PaymentMethodID: number;
  
    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;
  
    @Column('varchar')
    Method: string;
  
    @Column('varchar')
    CardholderName: string;
  
    @Column('date')
    ExpirationDate: Date;
  
    @Column('varchar')
    CardType: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  