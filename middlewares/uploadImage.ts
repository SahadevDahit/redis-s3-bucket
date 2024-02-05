import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

// Create an S3 instance using S3Client
const s3 = new S3Client({
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}` || "",
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}` || "",
    },
    region: `${process.env.AWS_REGION}` || "ap-south-1",
});

const storage = multerS3({
    s3: s3,
    bucket: `${process.env.AWS_S3_BUCKET}`,
    acl: "public-read",
    key: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        cb(null, fileName);
    },
});
// Create multer middleware
const upload = multer({ storage });

// Example usage in an Express route
const uploadToS3 = (req: any, res: any, next: any) => {
    upload.single("file")(req, res, (err: any) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }

        const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${req.file.key}`;
        res.locals.fileUrl = fileUrl;
        next();
    });
};

export { uploadToS3 };
