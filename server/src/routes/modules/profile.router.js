import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { changePasswordSchema, validateUpdateProfile } from '../../validators/profile.validator.js';
import * as ProfileController from '../../controllers/profile.controller.js';

const profileRouter = Router();

// authenticate đã được gắn ở main.router.js
// tất cả role đều vào được

// lấy thông tin cá nhân
profileRouter.get('/', ProfileController.getProfile);

// cập nhật thông tin cá nhân
// profileRouter.patch('/', validate(updateProfileSchema), ProfileController.updateProfile);
profileRouter.patch('/', validateUpdateProfile, ProfileController.updateProfile);

// đổi mật khẩu
profileRouter.patch(
  '/change-password',
  validate(changePasswordSchema),
  ProfileController.changePassword
);

// upload avatar
profileRouter.patch('/avatar', ProfileController.updateAvatar);

export default profileRouter;
