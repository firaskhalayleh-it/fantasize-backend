import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        const { entityType, entityName } = req.body;
        const baseFolder = path.join('resources', entityType, entityName);
        if (!fs.existsSync(baseFolder)) {
            fs.mkdirSync(baseFolder, { recursive: true });
        }
        cb(null, baseFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExtension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});


export const uploadFiles = (req: Request): Promise<Express.Multer.File[]> => {
    return new Promise((resolve, reject) => {
        upload.array('files')(req, {} as any, (error: any) => {
            if (error) {
                reject(error);
            } else if (!req.files || req.files.length === 0) {
                reject(new Error("File uploads required"));
            } else {
                resolve(req.files as Express.Multer.File[]);
            }
        });
    });
};
