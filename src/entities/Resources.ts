import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Resources extends BaseEntity{
  @PrimaryGeneratedColumn('increment')
  ResourceID: number;

  @Column('varchar')
  AttachmentPath: string;
}
