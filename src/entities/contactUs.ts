import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ContactUs extends BaseEntity {
    @PrimaryGeneratedColumn()
    ContactUsID: number;

    @Column('text')
    Name: string;

    @Column('text')
    Email: string;

    @Column('text')
    Subject: string;

    @Column('text')
    Message: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;


}