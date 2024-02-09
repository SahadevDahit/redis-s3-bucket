"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create an S3 instance using S3Client
const s3Client = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}` || "",
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}` || "",
    },
    region: `${process.env.AWS_REGION}` || "ap-south-1",
});
const bucketName = process.env.AWS_S3_BUCKET;
// Controller functions
const s3Controller = {
    uploadImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const profileImage = res.locals.fileUrl;
            console.log(res.locals);
            res.json({ success: true, message: "Image uploaded successfully", profileImage });
        }
        catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({ success: false, error: "Failed to upload image" });
        }
    }),
    getImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const imageName = req.params.imageName;
            const downloadParams = {
                Bucket: bucketName,
                Key: imageName
            };
            const data = yield s3Client.send(new client_s3_1.GetObjectCommand(downloadParams));
            // Check if data.Body is undefined before accessing it
            if (data.Body) {
                const readableStream = data.Body;
                readableStream.pipe(res);
            }
            else {
                console.error("Error getting image:", "Body is undefined");
                res.status(404).json({ success: false, error: "Image not found" });
            }
        }
        catch (error) {
            console.error("Error getting image:", error);
            res.status(404).json({ success: false, error: "Image not found" });
        }
    }),
    // Delete image from S3
    deleteImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const imageName = req.params.imageName;
            const deleteParams = {
                Bucket: bucketName,
                Key: imageName
            };
            const data = yield s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
            res.json({ success: true, message: "Image deleted successfully", data });
        }
        catch (error) {
            console.error("Error deleting image:", error);
            res.status(500).json({ success: false, error: "Failed to delete image" });
        }
    }),
    // Get all image names with URLs from S3 bucket
    getAllImages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            // Send list objects command to S3
            const listObjectsParams = {
                Bucket: bucketName
            };
            const data = yield s3Client.send(new client_s3_1.ListObjectsCommand(listObjectsParams));
            // Construct URLs for each image and collect them with names
            const images = ((_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map((object) => {
                const imageUrl = `https://${bucketName}.s3.amazonaws.com/${object.Key}`;
                return {
                    name: object.Key,
                    url: imageUrl
                };
            })) || [];
            res.json({ success: true, images });
        }
        catch (error) {
            console.error("Error getting image names:", error);
            res.status(500).json({ success: false, error: "Failed to get image names" });
        }
    })
};
exports.default = s3Controller;
