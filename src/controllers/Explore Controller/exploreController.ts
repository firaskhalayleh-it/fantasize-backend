//controller for explore

import { Request, Response } from "express";
import { s_getAllVideos } from "../../services/Explore Services/exploreService";


export const c_getAllVideos = async (req: Request, res: Response) => {
    await s_getAllVideos(req, res);
};