import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string({ required_error: "Tên là bắt buộc" }).min(2).max(50),
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email("Email không đúng định dạng"),
  password: z.string({ required_error: "Mật khẩu là bắt buộc" }).min(6),
  role: z.enum(["admin", "staff", "pt"], {
    required_error: "Role là bắt buộc",
    invalid_type_error: "Role phải là admin, staff hoặc pt",
  }),
  avatar: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "staff", "pt"]).optional(),
  avatar: z.string().optional(),
  is_active: z.number().min(0).max(1).optional(),
});
