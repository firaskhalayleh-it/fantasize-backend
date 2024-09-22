import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Cart extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    id:number

        
}