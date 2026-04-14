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

const userRouter = Router();

// public
userRouter.post('/admin/login', validate(adminLoginSchema), AuthController.adminLogin);
userRouter.post('/member/login', validate(memberLoginSchema), AuthController.memberLogin);
userRouter.post('/member/register', validate(memberRegisterSchema), AuthController.memberRegister);
// userRouter.post("/refresh", AuthController.refreshToken);
// userRouter.post("/logout", AuthController.logout);

// // cần đăng nhập
userRouter.get('/me', authenticate, AuthController.getMe);
// userRouter.put(
//   "/change-password",
//   authenticate,
//   validate(changePasswordSchema),
//   AuthController.changePassword,
// );
// userRouter.post(
//   "/forgot-password",
//   validate(forgotPasswordSchema),
//   AuthController.forgotPassword,
// );
// userRouter.post(
//   "/reset-password",
//   validate(resetPasswordSchema),
//   AuthController.resetPassword,
// );

export default userRouter;
