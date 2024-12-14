// table for storing general data of website as about us and contact us also the contact us form

import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class General extends BaseEntity {
    @PrimaryGeneratedColumn()
    GeneralID: number;

    @Column('jsonb')
    AboutUS: {
        title: string;
        description: string;

    }

    @Column('jsonb')
    ContactUS: {
        email: string;
        phone: string;
        address: string;
        website: string;
    }

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
}