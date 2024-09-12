import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity
  } from 'typeorm';
  
  @Entity()
  export class ProductCustomizations extends BaseEntity{
    @PrimaryGeneratedColumn()
    ProductCustomizationID: number;
  
    @Column('text')
    Options: string;
  
    @Column('text')
    Description: string;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  }
  