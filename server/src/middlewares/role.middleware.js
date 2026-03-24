import AppError from "../utils/error.util.js";

// kiểm tra role có được phép truy cập route không
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, "Vui lòng đăng nhập"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Không có quyền truy cập"));
    }

    next();
  };
};

// ==================== SHORTHAND ====================
// dùng trực tiếp thay vì requireRole('admin') cho gọn

// chỉ admin
export const isAdmin = "admin";

// admin + staff
export const isAdminOrStaff = requireRole("admin", "staff");

// admin + pt
export const isAdminOrPT = requireRole("admin", "pt");

// admin + staff + pt
export const isStaff = requireRole("admin", "staff", "pt");

// chỉ member
export const isMember = requireRole("member");
