import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Offers extends BaseEntity {
  @PrimaryGeneratedColumn()
  OfferID: number;

  @Column('decimal')
  Discount: number;

  @Column('timestamp')
  ValidFrom: Date;

  @Column('timestamp')
  ValidTo: Date;
}
