import { Request, Response } from "express";
import { Offers } from "../../entities/Offers";
import { Products } from "../../entities/products/Products";
import { Packages } from "../../entities/packages/Packages";
import { createNewOffer } from "../../utils/OfferNotification";
import { IsNull, LessThan, MoreThan, Not } from "typeorm";


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
        req.body.forEach( async(element :any) => {

        const {Discount, ValidFrom, ValidTo, ProductID } = element;
        if (!ValidFrom || isNaN(new Date(ValidFrom).getTime())) {
            return res.status(400).send({ message: "Invalid 'ValidFrom' date." });
        }

        if (!ValidTo || isNaN(new Date(ValidTo).getTime())) {
            return res.status(400).send({ message: "Invalid 'ValidTo' date." });
        }

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

        productOffer.Products = [ProductID];
        await productOffer.save();
        product.Offer = productOffer;

        await product.save();

        await createNewOffer();
    });

    return res.status(200).send({ message: "Product offer added successfully." });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }
}

//----------------------- Create a new offer for Package -----------------------
export const s_createOfferPackage = async (req: Request, res: Response) => {
    try {
        
        // console.log(req.body.length);
        req.body.forEach( async(element :any) => {
            // console.log("element",element.Discount);
            // console.log("element",element.ValidFrom);

            const { Discount, ValidFrom, ValidTo, PackageID } = element;
            console.log("================");
            console.log("ValidFrom",ValidFrom);
    console.log("ValidTo",ValidTo);
    console.log("Discount",Discount);
    console.log("PackageID",PackageID);
        
//         const { Discount, ValidFrom, ValidTo, PackageID } = req.body;
//         // console.log(req.body);
//         console.log("================");
//         console.log("ValidFrom",ValidFrom);
// console.log("ValidTo",ValidTo);
// console.log("Discount",Discount);
// console.log("PackageID",PackageID);
        if (!ValidFrom || isNaN(new Date(ValidFrom).getTime())) {
            return res.status(400).send({ message: "Invalid 'ValidFrom' date." });
        }

        if (!ValidTo || isNaN(new Date(ValidTo).getTime())) {
            return res.status(400).send({ message: "Invalid 'ValidTo' date." });
        }

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
    });
        return res.status(200).send({ message: "Package offer added successfully." });
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
};


//----------------------- Get all offers for all-----------------------

export const s_getAllOffers = async (req: Request, res: Response) => {
    try {
        const products = await Products.find({
            where: { Offer: Not(IsNull()) },
            relations: ["Offer", "Review", "Resource", "Customization", "SubCategory"]
        });

        const packages = await Packages.find({
            where: { Offer: Not(IsNull()) },
            relations: ["Offer", "Reviews", "Resource", "Customization", "SubCategory"]
        });

        const today = new Date().toISOString().slice(0, 23).replace('T', ' ');

        // Filter products with active offers
        const activeProductOffers = products.filter(product => {
            if (product.Offer && product.Offer.ValidFrom && product.Offer.ValidTo) {
                const validFrom = new Date(product.Offer.ValidFrom);
                const validTo = new Date(product.Offer.ValidTo);
                return validFrom < new Date(today) && validTo > new Date(today);
            }
            return false;
        }).map(product => ({
            ProductID: product.ProductID,
            Name: product.Name,
            Description: product.Description,
            Price: product.Price,
            Quantity: product.Quantity,
            Status: product.Status,
            Material: product.MaterialProduct.map(material => material),
            AvgRating: product.AvgRating,
            Offer: {
                OfferID: product.Offer.OfferID,
                Discount: product.Offer.Discount,
                IsActive: product.Offer.IsActive,
                ValidFrom: product.Offer.ValidFrom,
                ValidTo: product.Offer.ValidTo,
            },
            Review: product.Review.map(review => review),
            Resource: product.Resource.map(resource => resource),
            Customization: product.Customization.map(customization => customization),
            SubCategory: product.SubCategory ? product.SubCategory : null,
        }));

        // Filter packages with active offers
        const activePackageOffers = packages.filter(pkg => {
            if (pkg.Offer && pkg.Offer.ValidFrom && pkg.Offer.ValidTo) {
                const validFrom = new Date(pkg.Offer.ValidFrom);
                const validTo = new Date(pkg.Offer.ValidTo);
                return validFrom < new Date(today) && validTo > new Date(today);
            }
            return false;
        }).map(pkg => ({
            PackageID: pkg.PackageID,
            Name: pkg.Name,
            Description: pkg.Description,
            Price: pkg.Price,
            Quantity: pkg.Quantity,
            Status: pkg.Status,
            AvgRating: pkg.AvgRating,
            Offer: {
                OfferID: pkg.Offer.OfferID,
                Discount: pkg.Offer.Discount,
                IsActive: pkg.Offer.IsActive,
                ValidFrom: pkg.Offer.ValidFrom,
                ValidTo: pkg.Offer.ValidTo,
            },
            Review: pkg.Reviews.map(review => review),
            Resource: pkg.Resource.map(resource => resource),
            Customization: pkg.Customization.map(customization => customization),
            SubCategory: pkg.SubCategory ? pkg.SubCategory : null,
        }));

        if (activeProductOffers.length === 0 && activePackageOffers.length === 0) {
            return res.status(404).send({ message: "No active offers found" });
        }

        const combinedOffers = [...activeProductOffers, ...activePackageOffers];
        return res.status(200).send(combinedOffers);

    } catch (err: any) {
        console.log("Error:", err);
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
        const today = new Date();

        // Fetch products with active offers
        const products = await Products.find({
            where: {
                Offer: { ValidFrom: LessThan(today), ValidTo: MoreThan(today), IsActive: true }
            },
            relations: ["Offer", "Resource"]
        });

        // Fetch packages with active offers
        const packages = await Packages.find({
            where: {
                Offer: { ValidFrom: LessThan(today), ValidTo: MoreThan(today), IsActive: true }
            },
            relations: ["Offer", "Resource"]
        });

        // make the resources with fileType image only
        products.forEach(product => {
            product.Resource = product.Resource.filter(resource => resource.fileType.includes('image'));
        });

        packages.forEach(pkg => {
            pkg.Resource = pkg.Resource.filter(resource => resource.fileType.includes('image'));
        });
        // Combine products and packages, limiting to 3 items in total
        const homeOffers = [...products, ...packages]
            .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
            .slice(0, 3);

        return homeOffers.length > 0
            ? res.status(200).json(homeOffers)
            : res.status(404).send({ message: 'No offers found' });

    } catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}


