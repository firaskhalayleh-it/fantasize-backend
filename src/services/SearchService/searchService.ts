// src/services/SearchService/searchService.ts

import { Request, Response } from "express";
import { database } from "../../config/database"; // Your DataSource
import { Users } from "../../entities/users/Users";
import { Products } from "../../entities/products/Products";
import { Packages } from "../../entities/packages/Packages";
import { Orders } from "../../entities/Orders";
import { Like, Between, Brackets } from "typeorm";

// -------------------------------------------
// Search for Users by email or username
// -------------------------------------------
export const s_searchUser = async (req: Request, res: Response) => {
    try {
        const { search } = req.body || {};
        const userRepository = database.getRepository(Users);

        const conditions = [];
        if (search?.Email) {
            conditions.push({ Email: Like(`%${search.Email}%`) });
        }
        if (search?.Username) {
            conditions.push({ Username: Like(`%${search.Username}%`) });
        }

        if (conditions.length === 0) {
            return res.status(400).send({ message: "No search criteria provided" });
        }

        const users = await userRepository.find({
            where: conditions,
            take: 10, // limit results for pagination
        });

        if (users.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }
        return res.status(200).send(users);
    } catch (error: any) {
        console.error("Search User Error:", error);
        return res.status(500).send({ message: "Internal Server Error", error });
    }
};

// -------------------------------------------
// Search for Products and Packages
// with flexible criteria including:
// Name, Category, SubCategory, Brand,
// Description, Price range, Material,
// Offer, and Customizations.
// -------------------------------------------
export const s_search = async (req: Request, res: Response) => {
    try {
        const { search } = req.body || {};
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const skip = (page - 1) * limit;

        const productRepository = database.getRepository(Products);
        const packageRepository = database.getRepository(Packages);

        // Build product query
        const productQuery = productRepository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.SubCategory", "subCat")
            .leftJoinAndSelect("subCat.Category", "cat")
            .leftJoinAndSelect("product.Customization", "cust")
            .leftJoinAndSelect("product.MaterialProduct", "materialProd")
            .leftJoinAndSelect("materialProd.Material", "mat")
            .leftJoinAndSelect("product.Offer", "offer");

        if (search?.Name) {
            productQuery.andWhere("product.Name ILIKE :productName", { productName: `%${search.Name}%` });
        }

        if (search?.Category?.Name) {
            productQuery.andWhere("cat.Name ILIKE :catName", { catName: `%${search.Category.Name}%` });
        }

        if (search?.SubCategory?.Name) {
            productQuery.andWhere("subCat.Name ILIKE :subCatName", { subCatName: `%${search.SubCategory.Name}%` });
        }

        if (search?.Brand) {
            // Note: Brand is a ManyToOne - ensure Brand.Name is a column. If Brand is an entity, join it.
            // If `Brand` is an entity with a Name column, you'll need a join:
            // productQuery.leftJoinAndSelect("product.Brand", "brandEntity");
            // productQuery.andWhere("brandEntity.Name ILIKE :brandName", { brandName: `%${search.Brand}%` });
            // Adjust as per your schema. For now, assuming Brand is a column (string):
            productQuery.andWhere("CAST(product.Brand as varchar) ILIKE :brandName", { brandName: `%${search.Brand}%` });
        }

        if (search?.Description) {
            productQuery.andWhere("product.Description ILIKE :desc", { desc: `%${search.Description}%` });
        }

        if (typeof search?.minPrice === "number" && typeof search?.maxPrice === "number") {
            productQuery.andWhere("product.Price BETWEEN :minPrice AND :maxPrice", {
                minPrice: search.minPrice,
                maxPrice: search.maxPrice,
            });
        }

        if (search?.Material?.Name) {
            productQuery.andWhere("mat.Name ILIKE :materialName", { materialName: `%${search.Material.Name}%` });
        }

        if (search?.offer?.Available !== undefined) {
            productQuery.andWhere("offer.Available = :offerAvailable", { offerAvailable: search.offer.Available });
        }

        if (search?.offer?.Discount !== undefined) {
            productQuery.andWhere("offer.Discount = :offerDiscount", { offerDiscount: search.offer.Discount });
        }

        // Handle Customizations:
        // Example of search: { "Customizations": [{ "name": "color", "value": "pink" }] }
        // Assuming option is a JSONB column and using PostgreSQL JSON operators
        if (Array.isArray(search?.Customizations)) {
            search.Customizations.forEach((custObj: { name: string; value: string }, index: number) => {
                productQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(`cust.option->>'name' ILIKE :custName${index}`, { [`custName${index}`]: `%${custObj.name}%` })
                          .andWhere(`cust.option->'optionValues' @> :custValue${index}`, { 
                            [`custValue${index}`]: JSON.stringify([{ name: custObj.value }]) 
                          });
                    })
                );
            });
        }

        const [products, totalProducts] = await productQuery
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        // Build package query
        const packageQuery = packageRepository
            .createQueryBuilder("package")
            .leftJoinAndSelect("package.SubCategory", "subCat")
            .leftJoinAndSelect("subCat.Category", "cat")
            .leftJoinAndSelect("package.Customization", "cust")
            .leftJoinAndSelect("package.MaterialPackage", "materialPack")
            .leftJoinAndSelect("materialPack.Material", "mat")
            .leftJoinAndSelect("package.Offer", "offer");

        if (search?.Name) {
            packageQuery.andWhere("package.Name ILIKE :packageName", { packageName: `%${search.Name}%` });
        }

        if (search?.Category?.Name) {
            packageQuery.andWhere("cat.Name ILIKE :catName", { catName: `%${search.Category.Name}%` });
        }

        if (search?.SubCategory?.Name) {
            packageQuery.andWhere("subCat.Name ILIKE :subCatName", { subCatName: `%${search.SubCategory.Name}%` });
        }

        if (search?.Description) {
            packageQuery.andWhere("package.Description ILIKE :desc", { desc: `%${search.Description}%` });
        }

        if (typeof search?.minPrice === "number" && typeof search?.maxPrice === "number") {
            packageQuery.andWhere("package.Price BETWEEN :minPrice AND :maxPrice", {
                minPrice: search.minPrice,
                maxPrice: search.maxPrice,
            });
        }

        if (search?.Material?.Name) {
            packageQuery.andWhere("mat.Name ILIKE :materialName", { materialName: `%${search.Material.Name}%` });
        }

        if (search?.offer?.Available !== undefined) {
            packageQuery.andWhere("offer.Available = :offerAvailable", { offerAvailable: search.offer.Available });
        }

        if (search?.offer?.Discount !== undefined) {
            packageQuery.andWhere("offer.Discount = :offerDiscount", { offerDiscount: search.offer.Discount });
        }

        if (Array.isArray(search?.Customizations)) {
            search.Customizations.forEach((custObj: { name: string; value: string }, index: number) => {
                packageQuery.andWhere(
                    new Brackets((qb) => {
                        qb.andWhere(`cust.option->>'name' ILIKE :custNamePack${index}`, { [`custNamePack${index}`]: `%${custObj.name}%` })
                          .andWhere(`cust.option->'optionValues' @> :custValuePack${index}`, { 
                            [`custValuePack${index}`]: JSON.stringify([{ name: custObj.value }]) 
                          });
                    })
                );
            });
        }

        const [packages, totalPackages] = await packageQuery
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        if (!totalProducts && !totalPackages) {
            return res.status(404).send({ message: "No products or packages found." });
        }

        return res.status(200).send({
            data: { products, packages },
            metadata: {
                totalProducts,
                totalPackages,
                currentPage: page,
                totalPages: Math.ceil((totalProducts + totalPackages) / limit),
            },
        });
    } catch (error: any) {
        console.error("Search Error:", error);
        return res.status(500).send({ message: "Internal Server Error", error });
    }
};

// -------------------------------------------
// Searching orders by their products names,
// packages names, date range, and status
// -------------------------------------------
export const s_searchOrder = async (req: Request, res: Response) => {
    try {
        const { search } = req.body || {};
        const orderRepository = database.getRepository(Orders);

        // We'll build conditions using QueryBuilder since we need multiple relations.
        const orderQuery = orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.OrdersProducts", "op")
            .leftJoinAndSelect("op.Product", "prod")
            .leftJoinAndSelect("order.OrdersPackages", "opk")
            .leftJoinAndSelect("opk.Package", "pack");

        // Search by date range
        if (search?.startDate && search?.endDate) {
            orderQuery.andWhere("order.CreatedAt BETWEEN :startDate AND :endDate", {
                startDate: search.startDate,
                endDate: search.endDate,
            });
        }

        // Search by status
        if (search?.Status) {
            orderQuery.andWhere("order.Status ILIKE :status", { status: `%${search.Status}%` });
        }

        // Search by Product Name
        if (search?.Product?.Name) {
            orderQuery.andWhere("prod.Name ILIKE :prodName", { prodName: `%${search.Product.Name}%` });
        }

        // Search by Package Name
        if (search?.Package?.Name) {
            orderQuery.andWhere("pack.Name ILIKE :packName", { packName: `%${search.Package.Name}%` });
        }

        const orders = await orderQuery
            .take(10) // limit results for pagination or remove if not needed
            .getMany();

        if (orders.length === 0) {
            return res.status(404).send({ message: "No orders found" });
        }

        return res.status(200).send(orders);
    } catch (error: any) {
        console.error("Search Order Error:", error);
        return res.status(500).send({ message: "Internal Server Error", error });
    }
};
