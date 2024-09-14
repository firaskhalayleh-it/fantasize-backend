import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Offers extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  OfferID: number;

  @Column('decimal')
  Discount: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  ValidFrom: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  ValidTo: Date;
}
