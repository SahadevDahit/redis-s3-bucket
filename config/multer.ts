import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';


const storage: StorageEngine = multer.diskStorage({});

const fileFilter = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void): void => {
    let ext = path.extname(file.originalname);

    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        cb(new Error('File type is not supported'), false);
        return;
    }

    cb(null, true);
};

// Create the multer configuration object
const uploadConfig: any = {
    storage,
    fileFilter,
};

// Create the multer middleware
export const upload = multer(uploadConfig);

export default upload;
