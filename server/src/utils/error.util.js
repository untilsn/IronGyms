class AppError extends Error {
  constructor(statusCode, message, extra = null) {
    super(message);
    this.statusCode = statusCode;
    this.extra = extra;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

// các lỗi SQLite hay gặp
export const HTTP_ERRORS = {
  SQLITE_CONSTRAINT_UNIQUE: {
    statusCode: 409,
    message: "Dữ liệu đã tồn tại",
  },
  SQLITE_CONSTRAINT_FOREIGNKEY: {
    statusCode: 400,
    message: "Dữ liệu liên kết không tồn tại",
  },
};

export default AppError;
