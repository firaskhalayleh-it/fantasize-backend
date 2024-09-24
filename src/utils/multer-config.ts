import multer from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

// Configure storage with dynamic directories
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
        const customDir = req.body.customDir || req.body.userId || 'default';  // Default folder
        const folderPath = path.join('uploads/', customDir);

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });  // Recursively create the directory
        }

        cb(null, folderPath);  // Pass the folder path to Multer
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Use a timestamp to prevent name collisions
    }
});

// Filters for images, videos, and SVGs
const fileFilterBoth = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (
        file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || 
        file.mimetype === 'image/svg+xml' || // Add SVG support
        file.mimetype === 'video/mp4' || file.mimetype === 'video/x-msvideo'
    ) {
        cb(null, true);  // Accept valid image or video files
    } else {
        cb(null, false);  // Reject invalid files
    }
};

// Create a Multer instance using the dynamic storage and filter for images, videos, and SVGs
export const upload = multer({ storage: storage, fileFilter: fileFilterBoth });
