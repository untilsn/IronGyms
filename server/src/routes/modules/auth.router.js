import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  adminLoginSchema,
  memberLoginSchema,
  memberRegisterSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../validators/auth.validator.js";
import * as AuthController from "../../controllers/auth.controller.js";

const router = Router();

// public
router.post(
  "/admin/login",
  validate(adminLoginSchema),
  AuthController.adminLogin,
);
router.post(
  "/member/login",
  validate(memberLoginSchema),
  AuthController.memberLogin,
);
router.post(
  "/member/register",
  validate(memberRegisterSchema),
  AuthController.memberRegister,
);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

// cần đăng nhập
router.get("/me", authenticate, AuthController.getMe);
router.put(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  AuthController.changePassword,
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  AuthController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  AuthController.resetPassword,
);

export default router;
