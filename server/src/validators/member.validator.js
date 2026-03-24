import { z } from "zod";

export const createMemberSchema = z.object({
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
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  birthday: z.string().optional(),
});

export const updateMemberSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email("Email không đúng định dạng").optional(),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  birthday: z.string().optional(),
  avatar: z.string().optional(),
});
