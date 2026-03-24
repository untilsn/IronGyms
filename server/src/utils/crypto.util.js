import { randomBytes, randomUUID } from "node:crypto";

// tạo hex token 64 ký tự
// dùng cho: verify_email, forgot_password
export const generateToken = () => {
  return randomBytes(32).toString("hex");
};

// tạo UUID v4 duy nhất
// dùng cho: refresh_token, qr_code
export const generateUUID = () => {
  return randomUUID();
};

// tính thời gian hết hạn từ hiện tại + số phút
export const getExpiresAt = (minutes) => {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
};
