import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Resources extends BaseEntity{
  @PrimaryGeneratedColumn()
  ResourceID: number;

  @Column('varchar')
  AttachmentPath: string;
}
