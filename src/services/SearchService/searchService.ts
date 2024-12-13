// searching for a user by email

import { Request, Response } from "express";
import { Users } from "../../entities/users/Users";
import { Products } from "../../entities/products/Products";
import { Orders } from "../../entities/Orders";
import { Between, Like } from "typeorm";
import { Packages } from "../../entities/packages/Packages";



//searching for a user by email or username
export const s_searchUser = async (req: Request, res: Response) => {
    try {
        const { search } = req.body;
        const user = await Users.find({
            where: [
                { Email: Like(`%${search.Email}%`) },
                { Username: Like(`%${search.Username}%`) },
            ],
            take: 10, // limit results for pagination
        });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

// searching on json approach (searching for products and packages by name , customizations name and value setting price and category also sub category)
export const s_search = async (req: Request, res: Response) => {
    try {
        const { search } = req.body || {};
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Helper function to build query conditions
        const buildConditions = (entity: "Products" | "Packages") => {
            const conditions = [];
            if (search.Name) conditions.push({ Name: Like(`%${search.Name}%`) });
            if (search.SubCategory?.Name) conditions.push({ SubCategory: { Name: Like(`%${search.SubCategory.Name}%`) } });
            if (search.Material?.Name) conditions.push({ [`Material${entity}`]: { Material: { Name: Like(`%${search.Material.Name}%`) } } });
            if (search.Brand) conditions.push({ Brand: Like(`%${search.Brand}%`) });
            if (search.Description) conditions.push({ Description: Like(`%${search.Description}%`) });
            if (search.Category?.Name) conditions.push({ SubCategory: { Category: { Name: Like(`%${search.Category.Name}%`) } } });
            if (search.minPrice && search.maxPrice) conditions.push({ Price: Between(search.minPrice, search.maxPrice) });
            if (search.option?.name) conditions.push({ Customization: { option: { optionValues: { name: Like(`%${search.option.name}%`) } } } });
            if (search.offer.available) conditions.push({ Offer: { Available: search.offer.available } });
            if (search.offer.discount) conditions.push({ Offer: { Discount: search.offer.discount } });
            return conditions;
        };

        // Fetch products and packages with conditions
        const [products, totalProducts] = await Products.findAndCount({
            where: buildConditions("Products"),
            skip,
            take: limit,
            relations: [
                "SubCategory",
                "SubCategory.Category",
                "Customization",
                "MaterialProduct",
                "MaterialProduct.Material",
            ],
        });

        const [packages, totalPackages] = await Packages.findAndCount({
            where: buildConditions("Packages"),
            skip,
            take: limit,
            relations: [
                "SubCategory",
                "SubCategory.Category",
                "Customization",
                "MaterialPackage",
                "MaterialPackage.Material",
            ],
        });

        // Handle no results
        if (!totalProducts && !totalPackages) {
            return res.status(404).send({ message: "No products or packages found." });
        }

        // Response with metadata
        return res.status(200).send({
            data: { products, packages },
            metadata: {
                totalProducts,
                totalPackages,
                currentPage: page,
                totalPages: Math.ceil((totalProducts + totalPackages) / limit),
            },
        });
    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).send({ message: "Internal Server Error", error: error });
    }
};


// searching for order by its producs names and packages names also date and status
export const s_searchOrder = async (req: Request, res: Response) => {
    try {
        const { search } = req.body;
        const orders = await Orders.find({
            where: [
                { CreatedAt: Between(search.startDate, search.endDate) },
                { Status: Like(`%${search.Status}%`) },
                { OrdersProducts: { Product: { Name: Like(`%${search.Product.Name}%`) } } },
                { OrdersPackages: { Package: { Name: Like(`%${search.Package.Name}%`) } } }
            ],
            take: 10,
            relations: ["OrdersProducts", "OrdersProducts.Product", "OrdersPackages", "OrdersPackages.Package"],
        });
        if (!orders) {
            return res.status(404).send({ message: "Order not found" });
        }
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}

