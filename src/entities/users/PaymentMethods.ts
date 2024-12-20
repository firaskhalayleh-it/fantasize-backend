import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany
  } from 'typeorm';
  import { Users } from './Users';
  import { Orders } from '../Orders';
  
  @Entity()
  export class PaymentMethods extends BaseEntity{
    @PrimaryGeneratedColumn()
    PaymentMethodID: number;

    @ManyToOne(() => Users, (user) => user.UserID)
    User: Users;

    @OneToMany(() => Orders, (order) => order.PaymentMethod)
    Orders: Orders[];
  
    @Column('varchar')
    Method: string;

    @Column('varchar')
    CardholderName: string;

    @Column('varchar')
    CardNumber: string;

    @Column('date')
    ExpirationDate: Date;

    @Column('int')
    CVV: number;

    @Column('varchar')
    CardType: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
  }