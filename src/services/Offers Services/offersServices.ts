import { Request, Response } from "express";
import { Offers } from "../../entities/Offers";
import { Products } from "../../entities/products/Products";
import { Packages } from "../../entities/packages/Packages";
import { createNewOffer } from "../../utils/Offer Notification";


//----------------------- Create a new offer  -----------------------
export const s_createNewOffer = async (req: Request, res: Response) => {
    try {
        const { Discount, ValidFrom, ValidTo } = req.body;
        const validfrom = new Date(ValidFrom);
        const validto = new Date(ValidTo);
        const addNewOffer = Offers.create({
            Discount: Discount,
            ValidFrom: validfrom,
            ValidTo: validto,
        });

        await addNewOffer.save();
        return `Add an offer successfully`;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}
//----------------------- Create a new offer for Product -----------------------
export const s_createOfferProduct = async (req: Request, res: Response) => {
    try {
        const { Discount, ValidFrom, ValidTo, ProductID } = req.body;
        const validfrom = new Date(ValidFrom);
        const validto = new Date(ValidTo);
        const product = await Products.findOne({ where: { ProductID: ProductID } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const productOffer = Offers.create({
            Discount: Discount,
            ValidFrom: validfrom,
            ValidTo: validto,
        });

        // productOffer.Products = [product];
        await productOffer.save();
        product.Offer = productOffer;

        await product.save();

        await createNewOffer();

        return `Add a product offer successfully`;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Create a new offer for Package -----------------------
export const s_createOfferPackage = async (req: Request, res: Response) => {
    try {
        const { Discount, ValidFrom, ValidTo, PackageID } = req.body;
        const validfrom = new Date(ValidFrom);
        const validto = new Date(ValidTo);
        const pkg = await Packages.findOne({ where: { PackageID: PackageID } });
        if (!pkg) {
            return res.status(404).send({ message: "Package not found" });
        }
        const packageOffer = Offers.create({
            Discount: Discount,
            ValidFrom: validfrom,
            ValidTo: validto,
        });

        packageOffer.Packages = [PackageID];
        await packageOffer.save();
        pkg.Offer = packageOffer;
        await pkg.save();

        await createNewOffer();
        return `Add a package offer successfully`

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Get all offers for all-----------------------

export const s_getAllOffers = async (req: Request, res: Response) => {
    try {
        const offers = await Offers.find({
            where: { IsActive: true },
            relations: ["Products", "Packages"]
        });

        const validOffers = offers.filter((offer) => {
            const hasProducts = Array.isArray(offer.Products) && offer.Products.length > 0;
            const hasPackages = Array.isArray(offer.Packages) && offer.Packages.length > 0;

            const now = new Date();
            const validFrom = offer.ValidFrom ? new Date(offer.ValidFrom) : null;
            const validTo = offer.ValidTo ? new Date(offer.ValidTo) : null;
            const isWithinValidDates = (!validFrom || validFrom <= now) && (!validTo || validTo >= now);

            return (hasProducts || hasPackages) && isWithinValidDates;
        });

        if (validOffers.length === 0) {
            return res.status(404).send({ message: "No valid offers found" });
        }

        res.status(200).send(validOffers);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}


//----------------------- Get all offers for a product-----------------------

export const s_getAllOffersForProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId);
        const product = await Products.findOne({ where: { ProductID: productId } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const offers = await Offers.find({ where: { Products: { ProductID: productId } }, relations: ["Products"] });
        if (!offers) {
            return res.status(404).send({ message: "No offers found" });
        }
        return offers;

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Get all offers for a package-----------------------

export const s_getAllOffersForPackage = async (req: Request, res: Response) => {
    try {
        const packageId = Number(req.params.packageId);
        const pkg = await Packages.findOne({ where: { PackageID: packageId } });
        if (!pkg) {
            return res.status(404).send({ message: "Package not found" });
        }
        const offers = await Offers.find({ where: { Packages: { PackageID: packageId } }, relations: ["Packages"] });
        if (!offers) {
            return res.status(404).send({ message: "No offers found" });
        }
        return offers;

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Update an offer-----------------------

export const s_updateOffer = async (req: Request, res: Response) => {
    try {
        const offerId = Number(req.params.offerId);
        const { Discount, ValidFrom, ValidTo } = req.body;
        const validfrom = new Date(ValidFrom);
        const validto = new Date(ValidTo);
        const offer = await Offers.findOne({ where: { OfferID: offerId } });
        if (!offer) {
            return res.status(404).send({ message: "Offer not found" });
        }
        offer.Discount = Discount || offer.Discount;
        offer.ValidFrom = validfrom || offer.ValidFrom;
        offer.ValidTo = validto || offer.ValidTo;
        await offer.save();
        return offer;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- get offer by id----------------------

export const s_getOfferByID = async (req: Request, res: Response) => {
    try {
        const offerId = Number(req.params.offerId);
        const offer = await Offers.findOne({ where: { OfferID: offerId } });
        if (!offer) {
            return res.status(404).send({ message: "Offer not found" });
        }
        return offer;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//------------------------ home offers -----------------------
export const s_homeOffers = async (req: Request, res: Response) => {
    try {
        const offers = await Offers.createQueryBuilder("offer")
            .leftJoinAndSelect("offer.Products", "product")
            .leftJoinAndSelect("product.Resource", "productResource")
            .leftJoinAndSelect("offer.Packages", "package")
            .leftJoinAndSelect("package.Resource", "packageResource")
            .where("product.ProductID IS NOT NULL OR package.PackageID IS NOT NULL")
            .take(3)
            .getMany();
        if (offers.length === 0) {
            return res.status(404).send({ message: "No offers found" });
        }
        offers.forEach((offer) => {
            if (Array.isArray(offer.Products) && offer.Products.length > 0) {
                offer.Products.forEach((product) => {
                    console.log("Processing product: ", product);
                    if (Array.isArray(product.Resource) && product.Resource.length > 0) {
                        product.Resource[0];
                    }
                });
            }
            if (Array.isArray(offer.Packages) && offer.Packages.length > 0) {
                offer.Packages.forEach((pkg) => {
                    if (Array.isArray(pkg.Resource) && pkg.Resource.length > 0) {
                        pkg.Resource[0];
                    }
                });
            }
        });

        return res.status(200).send(offers);

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}


