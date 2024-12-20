import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, 'resources/');
    } catch (error) {
      cb(new Error('Failed to set or find destination'), '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed file types by MIME and extensions
  const fileTypes = /jpeg|jpg|png|mp4/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/') || file.mimetype === 'video/mp4';

  if (mimetype && extname) {
    cb(null, true);
  } else {
    // Reject the file without throwing an error
    const errorMessage = `Only JPEG, JPG, PNG images and MP4 videos are allowed. Received: ${file.mimetype}`;
    console.log(errorMessage);
    cb(null, false); // Reject file by passing `false` instead of an error
  }
};



const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter,
});

export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 10);
export const uploadFields = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 1 },
]);
export const uploadDynamic = multer({ storage: storage }).any();
