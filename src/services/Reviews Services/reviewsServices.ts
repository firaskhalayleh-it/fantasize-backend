// reviews services file

import { Request, Response } from 'express';
import { Reviews } from '../../entities/Reviews';
import { Products } from '../../entities/products/Products';
import { Packages } from '../../entities/packages/Packages';
import { Users } from '../../entities/users/Users';

//----------------------- Create a new review for a product-----------------------
export const s_createReviewProduct = async (req: Request, res: Response) => {
    try {
        const { Rating, Comment, ProductID } = req.body;
        const userID = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userID } });
        const product = await Products.findOne({ where: { ProductID: ProductID } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const review = Reviews.create({});
        review.User = user;
        review.Products.push(product);
        review.Rating = Rating;
        review.Comment = Comment;

        await review.save();
        return review;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Create a new review for a package-----------------------

export const s_createReviewPackage = async (req: Request, res: Response) => {
    try {
        const { Rating, Comment, PackageID } = req.body;
        const userID = (req as any).user.payload.userId;
        const user = await Users.findOne({ where: { UserID: userID } });
        const pkg = await Packages.findOne({ where: { PackageID: PackageID } });
        if (!pkg) {
            return res.status(404).send({ message: "Package not found" });
        }
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const review = Reviews.create({});
        review.User = user;
        review.Packages.push(pkg);
        review.Rating = Rating;
        review.Comment = Comment;

        await review.save();
        return review;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Get all reviews for a product-----------------------

export const s_getAllReviewsProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const product = await Products.findOne({ where: { ProductID: productId } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const reviews = await Reviews.find({ where: { Products: { ProductID: productId } }, relations: ["User"] });
        if (!reviews) {
            return res.status(404).send({ message: "No reviews found" });
        }
        return reviews;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Get all reviews for a package-----------------------


export const s_getAllReviewsPackage = async (req: Request, res: Response) => {
    try {
        const packageId = Number(req.params.packageId);
        const pkg = await Packages.findOne({ where: { PackageID: packageId } });
        if (!pkg) {
            return res.status(404).send({ message: "Package not found" });
        }
        const reviews = await Reviews.find({ where: { Packages: { PackageID: packageId } }, relations: ["User"] });
        if (!reviews) {
            return res.status(404).send({ message: "No reviews found" });
        }
        return reviews;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Update a review-----------------------

export const s_updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = Number(req.params.reviewId);
        const { Rating, Comment } = req.body;
        const reviewToUpdate = await Reviews.findOne({ where: { ReviewID: reviewId } });
        if (!reviewToUpdate) {
            return res.status(404).send({ message: "Review not found" });
        }
        reviewToUpdate.Rating = Rating || reviewToUpdate.Rating;
        reviewToUpdate.Comment = Comment || reviewToUpdate.Comment;

        const updatedReview = await reviewToUpdate.save();
        return updatedReview;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Delete a review-----------------------

export const s_deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = Number(req.params.reviewId);
        const review = await Reviews.findOne({ where: { ReviewID: reviewId } });
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        await review.remove();
        return "Review deleted";
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


