import AppError from "../utils/error.util.js";

// nhận vào zod schema → parse body → next nếu hợp lệ
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // lấy tất cả lỗi từ zod
      const errors = result.error.issues.map((e) => e.message).join(", ");

      return next(new AppError(400, errors));
    }

    // gán data đã được validate + transform vào req.body
    req.body = result.data;
    next();
  };
};
