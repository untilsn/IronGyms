import { z } from 'zod';

// ── base schemas per role ─────────────────────────────────

const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
});

const updateMemberSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z
    .string()
    .regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .nullable(),
  gender: z.enum(['male', 'female', 'other']).optional().nullable(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD')
    .optional()
    .nullable(),
});

const updatePtSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  specialty: z.string().max(200).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  experience: z.number().int().min(0).max(50).optional(),
});

// map role → schema
const schemaByRole = {
  admin: updateUserSchema,
  staff: updateUserSchema,
  pt: updatePtSchema,
  member: updateMemberSchema,
};

// ── dynamic validator dùng trong route ───────────────────

export const validateUpdateProfile = (req, res, next) => {
  const role = req.user?.role;
  const schema = schemaByRole[role];

  if (!schema) {
    return res.status(403).json({ success: false, message: 'Role không hợp lệ' });
  }

  // parse trước để strip field lạ
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  // sau khi strip xong mới check rỗng
  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Không có dữ liệu hợp lệ để cập nhật',
    });
  }

  req.body = parsed.data;
  next();
};

// ── change password (dùng chung mọi role) ────────────────

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
