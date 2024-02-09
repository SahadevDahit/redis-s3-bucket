import { S3Client, ListObjectsCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
// Create an S3 instance using S3Client
const s3Client = new S3Client({
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}` || "",
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}` || "",
    },
    region: `${process.env.AWS_REGION}` || "ap-south-1",
});

const bucketName = process.env.AWS_S3_BUCKET;

// Controller functions
const s3Controller = {

    uploadImage: async (req: Request, res: Response) => {
        try {
            const profileImage = res.locals.fileUrl;
            console.log(res.locals);
            res.json({ success: true, message: "Image uploaded successfully", profileImage });
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({ success: false, error: "Failed to upload image" });
        }
    },

    getImage: async (req: Request, res: Response) => {
        try {
            const imageName = req.params.imageName as string;
            const downloadParams = {
                Bucket: bucketName,
                Key: imageName
            };
            const data = await s3Client.send(new GetObjectCommand(downloadParams));

            // Check if data.Body is undefined before accessing it
            if (data.Body) {
                const readableStream = data.Body as Readable;
                readableStream.pipe(res);
            } else {
                console.error("Error getting image:", "Body is undefined");
                res.status(404).json({ success: false, error: "Image not found" });
            }
        } catch (error) {
            console.error("Error getting image:", error);
            res.status(404).json({ success: false, error: "Image not found" });
        }
    },


    // Delete image from S3
    deleteImage: async (req: Request, res: Response) => {
        try {
            const imageName = req.params.imageName as string;
            const deleteParams = {
                Bucket: bucketName,
                Key: imageName
            };
            const data = await s3Client.send(new DeleteObjectCommand(deleteParams));
            res.json({ success: true, message: "Image deleted successfully", data });
        } catch (error) {
            console.error("Error deleting image:", error);
            res.status(500).json({ success: false, error: "Failed to delete image" });
        }
    },
    // Get all image names with URLs from S3 bucket
    getAllImages: async (req: Request, res: Response) => {
        try {
            // Send list objects command to S3
            const listObjectsParams = {
                Bucket: bucketName
            };
            const data = await s3Client.send(new ListObjectsCommand(listObjectsParams));

            // Construct URLs for each image and collect them with names
            const images = data.Contents?.map((object) => {
                const imageUrl = `https://${bucketName}.s3.amazonaws.com/${object.Key}`;
                return {
                    name: object.Key,
                    url: imageUrl
                };
            }) || [];

            res.json({ success: true, images });
        } catch (error) {
            console.error("Error getting image names:", error);
            res.status(500).json({ success: false, error: "Failed to get image names" });
        }
    }

};

export default s3Controller;
