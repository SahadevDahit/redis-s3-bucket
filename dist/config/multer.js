"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({});
const fileFilter = (req, file, cb) => {
    let ext = path_1.default.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        cb(new Error('File type is not supported'), false);
        return;
    }
    cb(null, true);
};
// Create the multer configuration object
const uploadConfig = {
    storage,
    fileFilter,
};
// Create the multer middleware
exports.upload = (0, multer_1.default)(uploadConfig);
exports.default = exports.upload;
