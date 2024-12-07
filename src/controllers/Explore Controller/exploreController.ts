//controller for explore

import { Request, Response } from "express";
import { s_getAllVideos } from "../../services/Explore Services/exploreService";


export const c_getAllVideos = async (req: Request, res: Response) => {
    const response = await s_getAllVideos(req, res);
    return res.status(200).send(response);
};