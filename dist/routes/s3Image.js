"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const s3Image_1 = __importDefault(require("../controllers/s3Image"));
const uploadImage_1 = require("../middlewares/uploadImage");
const router = express_1.default.Router();
router.post("/upload", uploadImage_1.uploadToS3, s3Image_1.default.uploadImage);
router.get("/image/:imageName", s3Image_1.default.getImage);
router.delete("/image/:imageName", s3Image_1.default.deleteImage);
router.get("/images", s3Image_1.default.getAllImages);
exports.default = router;
