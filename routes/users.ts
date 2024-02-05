import express from 'express';
import { uploadToS3 } from "../middlewares/uploadImage";

import {
    getUsers,
    getUserById,
    signUp,
    signIn,
    updateUser,
    deleteUser,
} from '../controllers/users';
import { isLoggedIn } from '../middlewares/isLoggedIn';
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', uploadToS3, signUp);
router.post('/signin', signIn)
router.patch('/:id', isLoggedIn, updateUser);
router.delete('/:id', isLoggedIn, deleteUser);

export default router;
