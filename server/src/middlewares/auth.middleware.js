import { verifyAccessToken } from "../utils/jwt.util.js";
import AppError from "../utils/error.util.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) throw new AppError(401, "Vui lòng đăng nhập");

    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    // JWT hết hạn → FE dùng expired flag để tự refresh
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập đã hết hạn",
        expired: true,
      });
    }

    // JWT không hợp lệ
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }

    // lỗi khác → chuyển xuống error middleware
    next(err);
  }
};
