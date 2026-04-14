import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import {
  adminLoginSchema,
  memberLoginSchema,
  memberRegisterSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../../validators/auth.validator.js';
import * as AuthController from '../../controllers/auth.controller.js';

const authRouter = Router();

// public
authRouter.post('/admin/login', validate(adminLoginSchema), AuthController.adminLogin);
authRouter.post('/member/login', validate(memberLoginSchema), AuthController.memberLogin);
authRouter.post('/member/register', validate(memberRegisterSchema), AuthController.memberRegister);
authRouter.post('/refresh', AuthController.refreshToken);
authRouter.post('/logout', AuthController.logout);

// // cần đăng nhập
authRouter.get('/me', authenticate, AuthController.getMe);
// authRouter.put(
//   "/change-password",
//   authenticate,
//   validate(changePasswordSchema),
//   AuthController.changePassword,
// );
// authRouter.post(
//   "/forgot-password",
//   validate(forgotPasswordSchema),
//   AuthController.forgotPassword,
// );
// authRouter.post(
//   "/reset-password",
//   validate(resetPasswordSchema),
//   AuthController.resetPassword,
// );

export default authRouter;
