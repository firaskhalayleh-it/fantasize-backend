// general service for general data of website as about us and contact us 
import { General } from "../../entities/general";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

// get all general data
export const s_getGeneral = async (req: Request, res: Response) => {
    const generalRepository = getRepository(General);
    const general = await generalRepository.find();
    return general;

}

// update general data (first row only)
export const s_updateGeneral = async (req: Request, res: Response) => {
    const generalRepository = getRepository(General);
    const general = await generalRepository.findOne({ where: { GeneralID: 1 } });
    if (!general) {
        return res.status(404).json({ message: "General data not found" });
    }
    general.AboutUS = req.body.AboutUS;
    general.ContactUS = req.body.ContactUS;
    const errors = await validate(general);
    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }
    await generalRepository.save(general);
    return general;
}

// add new general data first row only
export const s_addGeneral = async (req: Request, res: Response) => {
    const generalRepository = getRepository(General);
    const general = new General();
    general.AboutUS = req.body.AboutUS;
    general.ContactUS = req.body.ContactUS;
    const errors = await validate(general);
    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }
    await generalRepository.save(general);
    return general;
}

