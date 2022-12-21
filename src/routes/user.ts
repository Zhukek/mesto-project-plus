import { Router } from 'express';
import {
  getUserById, getUsers, updateAvatar, updateUser,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
