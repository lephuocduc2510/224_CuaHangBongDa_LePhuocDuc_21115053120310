import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';

const router = Router();

// Tất cả các routes đều yêu cầu đăng nhập
router.use(authenticate);

// Routes
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.post('/avatar', uploadAvatar.single('avatar') as any, profileController.updateAvatar);
router.put('/change-password', profileController.changePassword);

export default router;