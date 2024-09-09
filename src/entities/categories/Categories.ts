import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn()
  CategoryID: number;

  @Column('varchar')
  Name: string;
}
