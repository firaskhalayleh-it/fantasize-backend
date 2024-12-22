import { Request, Response } from 'express';
import { Packages } from '../../entities/packages/Packages';
import { FavoritePackages } from '../../entities/packages/FavoritePackages';

//-----------------------Add a package to favorites-----------------------
export const s_addPackageFavorites = async (req:Request , res:Response) =>{
try{
        const packageId :any  = req.params.packageId;
        const  userId  = (req as any).user.payload.userId;
        const packageIsExist = await Packages.findOne({where:{PackageID:packageId}});
        if(!packageIsExist){
                return ({ message: "paackage not found" });
        }
        const favoritePackage = await FavoritePackages.findOne({where :{Package :{PackageID:packageId} , User:{UserID:userId}}})
        if(favoritePackage){
            return ({ message: "Package already in favorites" });
        };
        const addPackageFavorite= FavoritePackages.create({
                Package:packageIsExist,
                User:userId
        });

        await addPackageFavorite.save();
        return "package added to favorites";

}catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
    }

} 

//----------------------- Get all favorite packages for a user-----------------------
export const s_getAllFavoritePackagesUser = async (req:Request , res:Response) =>{
try{
        const  userId  = (req as any).user.payload.userId;

        const getAllFavoritePackages = await FavoritePackages.find({where :{User:{UserID:userId} },relations :['Package']})
        
        return getAllFavoritePackages;
}catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
}
} 

//----------------------- Remove a package from favorites-----------------------
export const s_removePackageFavorites = async (req:Request , res:Response) =>{
try{
        const packageId :any  = req.params.packageId;
        const  userId  = (req as any).user.payload.userId;
        const packageIsExist = await Packages.findOne({where:{PackageID:packageId}});
        if(!packageIsExist){
                return ({ message: "paackage not found" });
        }
        const favoritePackage = await FavoritePackages.findOne({where :{Package :{PackageID:packageId} , User:{UserID:userId}}})
        if(!favoritePackage){
            return ({ message: "Package not in favorites" });
        };
        await favoritePackage.remove();
        await favoritePackage.save();

        return "package removed from favorites";
}catch (err: any) {
        console.log(err);
        res.status(500).send({ message: err.message })
}
} 