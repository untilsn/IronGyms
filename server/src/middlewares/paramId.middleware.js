import AppError from "../utils/error.util.js";

// kiểm tra :id trên URL có phải số nguyên dương không
export const validateParamId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return next(new AppError(400, "ID không hợp lệ"));
  }

  // gán lại id đã parse để dùng trong controller
  req.params.id = id;
  next();
};
