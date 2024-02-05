"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../middlewares/uploadImage");
const users_1 = require("../controllers/users");
const isLoggedIn_1 = require("../middlewares/isLoggedIn");
const router = express_1.default.Router();
router.get('/', users_1.getUsers);
router.get('/:id', users_1.getUserById);
router.post('/', uploadImage_1.uploadToS3, users_1.signUp);
router.post('/signin', users_1.signIn);
router.patch('/:id', isLoggedIn_1.isLoggedIn, users_1.updateUser);
router.delete('/:id', isLoggedIn_1.isLoggedIn, users_1.deleteUser);
exports.default = router;
