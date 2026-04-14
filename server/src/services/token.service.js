import db from '../config/database.config.js';
import { generateToken, generateUUID, getExpiresAt } from '../utils/crypto.util.js';

// ==================== INTERNAL ====================

// lưu token vào db — xóa token cũ trước
const saveToken = ({ userId, memberId, type, token, expiresMinutes }) => {
  // xóa token cũ cùng loại
  if (userId) {
    db.prepare(
      `
      DELETE FROM tokens WHERE user_id = ? AND type = ?
    `
    ).run(userId, type);
  }

  if (memberId) {
    db.prepare(
      `
      DELETE FROM tokens WHERE member_id = ? AND type = ?
    `
    ).run(memberId, type);
  }

  // lưu token mới
  db.prepare(
    `
    INSERT INTO tokens (user_id, member_id, type, token, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `
  ).run(userId || null, memberId || null, type, token, getExpiresAt(expiresMinutes));

  return token;
};

// kiểm tra token có trong db và chưa hết hạn
const verifyStoredToken = (token, type) => {
  const record = db
    .prepare(
      `
    SELECT * FROM tokens WHERE token = ? AND type = ?
  `
    )
    .get(token, type);

  if (!record) return null;

  // hết hạn → xóa + trả null
  if (new Date(record.expires_at) < new Date()) {
    db.prepare(`DELETE FROM tokens WHERE id = ?`).run(record.id);
    return null;
  }

  return record;
};

// xóa token sau khi dùng
const deleteStoredToken = (token, type) => {
  db.prepare(
    `
    DELETE FROM tokens WHERE token = ? AND type = ?
  `
  ).run(token, type);
};

// ==================== REFRESH TOKEN ====================

export const generateRefreshToken = ({ userId, memberId }) => {
  console.log(userId, memberId);
  return saveToken({
    userId,
    memberId,
    type: 'refresh',
    token: generateUUID(),
    expiresMinutes: 7 * 24 * 60,
  });
};

export const verifyRefreshToken = token => {
  return verifyStoredToken(token, 'refresh');
};

export const deleteRefreshToken = token => {
  deleteStoredToken(token, 'refresh');
};

// ==================== VERIFY EMAIL TOKEN ====================

export const generateVerifyEmailToken = ({ userId, memberId }) => {
  return saveToken({
    userId,
    memberId,
    type: 'verify_email',
    token: generateToken(),
    expiresMinutes: 24 * 60,
  });
};

// verify + tự xóa sau khi dùng — 1 lần duy nhất
export const verifyEmailToken = token => {
  const record = verifyStoredToken(token, 'verify_email');
  if (!record) return null;
  deleteStoredToken(token, 'verify_email');
  return record;
};

// ==================== FORGOT PASSWORD TOKEN ====================

export const generateForgotPasswordToken = ({ userId, memberId }) => {
  return saveToken({
    userId,
    memberId,
    type: 'forgot_password',
    token: generateToken(),
    expiresMinutes: 15,
  });
};

// verify + tự xóa sau khi dùng — 1 lần duy nhất
export const verifyForgotPasswordToken = token => {
  const record = verifyStoredToken(token, 'forgot_password');
  if (!record) return null;
  deleteStoredToken(token, 'forgot_password');
  return record;
};

// src/
// ├── utils/
// │   ├── crypto.util.js    → generateToken, generateUUID, getExpiresAt
// │   ├── jwt.util.js       → signAccessToken, verifyAccessToken
// │   ├── hash.util.js      → hashPassword, comparePassword
// │   ├── qr.util.js        → generateQrCode
// │   ├── slug.util.js      → generateSlug, generateUniqueSlug
// │   ├── error.util.js     → AppError, Errors
// │   └── date.util.js      → calcEndDate, today, formatDate...
// │
// └── services/
//     ├── token.service.js  → saveToken, verifyStoredToken
//     │                        generateRefreshToken
//     │                        generateVerifyEmailToken
//     │                        generateForgotPasswordToken
//     └── auth.service.js   → dùng token.service
