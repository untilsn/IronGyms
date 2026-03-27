import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email("Email không đúng định dạng"),
  password: z
    .string({ required_error: "Mật khẩu là bắt buộc" })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const memberLoginSchema = z.object({
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email("Email không đúng định dạng"),
  password: z
    .string({ required_error: "Mật khẩu là bắt buộc" })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const memberRegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Tên là bắt buộc" })
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được quá 50 ký tự"),
    email: z
      .string({ required_error: "Email là bắt buộc" })
      .email("Email không đúng định dạng"),
    password: z
      .string({ required_error: "Mật khẩu là bắt buộc" })
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string({
      required_error: "Xác nhận mật khẩu là bắt buộc",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: "Mật khẩu cũ là bắt buộc" })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  newPassword: z
    .string({ required_error: "Mật khẩu mới là bắt buộc" })
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string({
    required_error: "Xác nhận mật khẩu là bắt buộc",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email("Email không đúng định dạng"),
});

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: "Token là bắt buộc" }),
  newPassword: z
    .string({ required_error: "Mật khẩu mới là bắt buộc" })
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirmPassword: z.string({
    required_error: "Xác nhận mật khẩu là bắt buộc",
  }),
});
