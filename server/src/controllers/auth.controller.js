import env from '../config/env.config.js';
import * as AuthService from '../services/auth.service.js';

// ==================== HELPERS ====================
const setTokenCookie = (res, token) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearTokenCookie = res => {
  res.clearCookie('refresh_token');
};

// ==================== LOGIN ====================
export const adminLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = AuthService.adminLogin(email, password);

    setTokenCookie(res, result.refreshToken);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        accessToken: result.accessToken,
        user: result.user,
        trainerProfile: result.trainerProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const memberLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = AuthService.memberLogin(email, password);

    setTokenCookie(res, result.refreshToken);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        accessToken: result.accessToken,
        member: result.member,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==================== REGISTER ====================
export const memberRegister = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = AuthService.memberRegister(name, email, password);

    setTokenCookie(res, result.refreshToken);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        accessToken: result.accessToken,
        member: result.member,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==================== REFRESH TOKEN ====================
export const refreshToken = (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;
    const result = AuthService.refreshAccessToken(token);

    res.json({
      success: true,
      message: 'Token đã được làm mới',
      accessToken: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// ==================== LOGOUT ====================
export const logout = (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token; // fix: đổi tên tránh shadow với export
    AuthService.logout(token);

    clearTokenCookie(res); // fix: tên đúng, bỏ chữ "s" thừa

    res.json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  } catch (err) {
    next(err);
  }
};

// ==================== GET ME ====================
export const getMe = (req, res, next) => {
  try {
    const { id, role } = req.user;
    const data = AuthService.getMe(id, role);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { oldPassword, newPassword } = req.body;
    const result = AuthService.changePassword(id, role, oldPassword, newPassword);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = (req, res, next) => {
  try {
    const { email } = req.body;
    const result = AuthService.forgotPassword(email);

    res.json({
      success: true,
      message: result.message,
      ...(result.token && { token: result.token }), // chỉ expose khi dev
    });
  } catch (err) {
    next(err);
  }
};

// ==================== RESET PASSWORD ====================
export const resetPassword = (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = AuthService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
