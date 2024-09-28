import multer from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
        const customDir = req.body.customDir || req.params.userId || 'default'; 
        const folderPath = path.join('uploads/', customDir);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });  
        }

        cb(null, folderPath); 
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilterBoth = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (
        file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || 
        file.mimetype === 'image/svg+xml' || 
        file.mimetype === 'video/mp4' || file.mimetype === 'video/x-msvideo'
    ) {
        cb(null, true);  
    } else {
        cb(null, false);  
    }
};

export const upload = multer({ storage: storage, fileFilter: fileFilterBoth });
