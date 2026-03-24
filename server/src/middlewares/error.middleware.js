import AppError, { HTTP_ERRORS } from "../utils/error.util.js";

const errorMiddleware = (err, req, res, next) => {
  // AppError — lỗi nghiệp vụ có chủ đích từ service
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.extra && { extra: err.extra }),
    });
  }

  // SQLite errors — tra trong HTTP_ERRORS
  const sqliteError = HTTP_ERRORS[err.code];
  if (sqliteError) {
    return res.status(sqliteError.statusCode).json({
      success: false,
      message: sqliteError.message,
    });
  }

  // lỗi không xác định — log ra terminal
  console.error("❌ Unexpected error:", err);
  return res.status(500).json({
    success: false,
    message: "Lỗi server, vui lòng thử lại sau",
  });
};

export default errorMiddleware;
