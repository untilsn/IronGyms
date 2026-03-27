import env from "../config/env.config.js";
import * as AuthService from "../services/auth.service.js";

const setTokenCookie = (res, token) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearTokenCookie = (res) => {
  res.clearCookie("refresh_token");
};

export const adminLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = AuthService.adminLogin(email, password);

    setTokenCookie(res, result.refreshToken);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        user: result.user,
        trainerProfile: result.trainerProfile,
      },
      accessToken: result.accessToken,
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
      message: "Đăng nhập thành công",
      data: { member: result.member },
      accessToken: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

export const memberRegister = (req, res, next) => {
  try {
    const result = AuthService.memberRegister(req.body);

    setTokenCookie(res, result.refreshToken);

    res.json({
      success: true,
      message: "Đăng ký thành công",
      data: { member: result.member },
      accessToken: result.accessToken,
    });
  } catch (err) {
    next(err);
  }
};
