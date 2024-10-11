// ordered customization entity for user orders
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, BaseEntity } from "typeorm";
import { OrdersPackages } from "./packages/OrdersPackages";
import { OrdersProducts } from "./products/OrdersProducts";
import { Resources } from "./Resources";

@Entity()
export class OrderedCustomization extends BaseEntity {
    @PrimaryGeneratedColumn()
    OrderedCustomizationID: number;

    @OneToOne(() => OrdersProducts, (ordersProduct) => ordersProduct.OrderedCustomization)
    OrdersProducts: OrdersProducts;

    @OneToOne(() => OrdersPackages, (ordersPackages) => ordersPackages.OrderedCustomization)
    OrdersPackages: OrdersPackages;

    @Column('jsonb', { nullable: true })
    SelectedOptions: {
        name: string;
        type: string;
        optionValues: {
            name: string;
            value: string;
            isSelected: boolean;
            filePath?: string;
        }[];
    }[];


    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;
}