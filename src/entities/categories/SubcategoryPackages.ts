import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { SubCategories } from './SubCategories';
import { Packages } from '../packages/Packages';

@Entity()
export class SubcategoryPackages extends BaseEntity {
    @PrimaryColumn()
    SubCategoryID: number;

    @PrimaryColumn()
    PackageID: number;

    @ManyToOne(() => SubCategories, (subcategory) => subcategory.SubCategoryID)
    SubCategory: SubCategories;

    @ManyToOne(() => Packages, (pkg) => pkg.PackageID)
    Package: Packages;
}
