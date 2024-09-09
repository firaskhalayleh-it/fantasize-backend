import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { SubCategories } from './SubCategories';
import { Products } from '../products/Products';

@Entity()
export class SubcategoryProducts extends BaseEntity {
    @PrimaryColumn()
    SubCategoryID: number;

    @PrimaryColumn()
    ProductID: number;

    @ManyToOne(() => SubCategories, (subcategory) => subcategory.SubCategoryID)
    SubCategory: SubCategories;

    @ManyToOne(() => Products, (product) => product.ProductID)
    Product: Products;
}
