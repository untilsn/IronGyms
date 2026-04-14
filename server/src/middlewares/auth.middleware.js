import { verifyAccessToken } from '../utils/jwt.util.js';
import AppError from '../utils/error.util.js';

export const authenticate = (req, res, next) => {
  try {
    // đọc access token từ Authorization header
    // FE gửi: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Vui lòng đăng nhập');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Phiên đăng nhập đã hết hạn',
        expired: true,
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }
    next(err);
  }
};
