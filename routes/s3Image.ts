import express from "express";
import s3Controller from "../controllers/s3Image";
import { uploadToS3 } from "../middlewares/uploadImage";
const router = express.Router();
router.post("/upload", uploadToS3, s3Controller.uploadImage);
router.get("/image/:imageName", s3Controller.getImage);
router.delete("/image/:imageName", s3Controller.deleteImage);
router.get("/images", s3Controller.getAllImages);
export default router;
