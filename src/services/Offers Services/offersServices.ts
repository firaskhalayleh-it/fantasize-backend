import { Request, Response } from "express";
import { Offers } from "../../entities/Offers";
import { Products } from "../../entities/products/Products";
import { Packages } from "../../entities/packages/Packages";


//----------------------- Create a new offer  -----------------------
export const s_createNewOffer = async (req: Request, res: Response) => {
    try {
        const { IsActive, Discount, ValidFrom, ValidTo } = req.body;
        console.log(req.body);
        let [day, month, year] = ValidFrom.split('/');
        const validfrom = new Date(`${year}-${month}-${day}`);
        [day, month, year] = ValidTo.split('/');
        const validto = new Date(`${year}-${month}-${day}`);
        const addNewOffer = Offers.create({
            Discount: Discount,
            IsActive: IsActive,
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
        const { IsActive, Discount, ValidFrom, ValidTo, ProductID } = req.body;
        const validfrom = new Date(ValidFrom);
        const validto = new Date(ValidTo);
        const product = await Products.findOne({ where: { ProductID: ProductID } });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const productOffer = Offers.create({
            Discount: Discount,
            IsActive: IsActive,
            ValidFrom: validfrom,
            ValidTo: validto,
        });

        // productOffer.Products = [product];
        await productOffer.save();
        product.Offer = productOffer;

        await product.save();


        return `Add a product offer successfully`;
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Create a new offer for Package -----------------------
export const s_createOfferPackage = async (req: Request, res: Response) => {
    try {
        const { IsActive, Discount, ValidFrom, ValidTo, PackageID } = req.body;
        const validfrom = new Date(ValidFrom);
        const validto = new Date(ValidTo);
        const pkg = await Packages.findOne({ where: { PackageID: PackageID } });
        if (!pkg) {
            return res.status(404).send({ message: "Package not found" });
        }
        const packageOffer = Offers.create({
            Discount: Discount,
            IsActive: IsActive,
            ValidFrom: validfrom,
            ValidTo: validto,
        });

        packageOffer.Packages = [PackageID];
        await packageOffer.save();
        pkg.Offer = packageOffer;
        await pkg.save();

        return `Add a package offer successfully`

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}


//----------------------- Get all offers for all-----------------------

export const s_getAllOffers = async (req: Request, res: Response) => {
    try {
        const offers = await Offers.find({ relations: ["Products", "Packages"] });
        if (offers.length === 0) {
            return res.status(404).send({ message: "No offers found" });
        }
        return offers;

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
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
        const { IsActive, Discount, ValidFrom, ValidTo } = req.body;
        const validfrom = new Date(ValidFrom);
        const validto = new Date(ValidTo);
        const offer = await Offers.findOne({ where: { OfferID: offerId } });
        if (!offer) {
            return res.status(404).send({ message: "Offer not found" });
        }
        offer.Discount = Discount || offer.Discount;
        offer.IsActive = IsActive
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
        const offers = await Offers.find({ relations: ["Products", "Packages"], take: 3 });
        if (offers.length === 0) {
            return res.status(404).send({ message: "No offers found" });
        }
        offers.map((offer) => {
            if (offer.Products.length > 0) {
                offer.Products.map((product) => {
                    product.Resource[0];
                })
            }
            if (offer.Packages.length > 0) {
                offer.Packages.map((pkg) => {
                    pkg.Resource[0];
                })
            }
        })
        return offers;

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}
