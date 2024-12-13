// searching for a user by email

import { Request, Response } from "express";
import { Users } from "../../entities/users/Users";
import { Products } from "../../entities/products/Products";



//searching for a user by email or username
export const s_searchUser = async (req: Request, res: Response) => {
    try {
        const { search } = req.body;
        const user = await Users.find({
            where: [
                { Email: search },
                { Username: search }
            ]
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
        const { search } = req.body;
        const products = await Products.find({
            where: [
                { Name: search },
                { SubCategory: search },
                { SubCategory: search },
                { Price: search },
                { Customization: { option: search } }
            ]
        });
        if (!products) {
            return res.status(404).send({ message: "Product not found" });
        }
        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}




