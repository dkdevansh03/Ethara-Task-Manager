import express from 'express';
import auth from '../middleware/auth.js';
import { getUsers } from '../controllers/userController.js';

const router = express.Router();

router.use(auth);

router.get('/', getUsers);

export default router;