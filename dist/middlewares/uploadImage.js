"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create an S3 instance using S3Client
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}` || "",
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}` || "",
    },
    region: `${process.env.AWS_REGION}` || "ap-south-1",
});
const storage = (0, multer_s3_1.default)({
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
const upload = (0, multer_1.default)({ storage });
// Example usage in an Express route
const uploadToS3 = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }
        console.log(req.file);
        const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${req.file.key}`;
        res.locals.fileUrl = fileUrl;
        next();
    });
};
exports.uploadToS3 = uploadToS3;
