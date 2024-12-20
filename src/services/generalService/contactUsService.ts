// contact us service for contact us form

import { ContactUs } from "../../entities/contactUs";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

// get all contact us messages
export const s_getContactUs = async (req: Request, res: Response) => {
    const contactUsRepository = (ContactUs);
    const contactUs = await contactUsRepository.find();
    return contactUs;

}

// get contact us message by id
export const s_getContactUsById = async (req: Request, res: Response) => {
    const contactUsRepository = (ContactUs);
    const contactUs = await contactUsRepository.findOne({ where: { ContactUsID: Number(req.params.id) } });
    if (!contactUs) {
        return res.status(404).json({ message: "Contact us message not found" });
    }
    return contactUs;
}

// add new contact us message
export const s_addContactUs = async (req: Request, res: Response) => {
    const contactUsRepository = (ContactUs);
    const contactUs = new ContactUs();
    contactUs.Name = req.body.Name;
    contactUs.Email = req.body.Email;
    contactUs.Subject = req.body.Subject;
    contactUs.Message = req.body.Message;
    const errors = await validate(contactUs);
    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }
    await contactUsRepository.save(contactUs);
    return contactUs;
}


