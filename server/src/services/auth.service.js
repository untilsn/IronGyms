import db from "../config/database.config.js";
import { generateRefreshToken } from "../services/token.service.js";
import AppError from "../utils/error.util.js";
import { comparePassword, hashPassword } from "../utils/hash.util.js";
import { signAccessToken } from "../utils/jwt.util.js";
import { generateQrCode } from "../utils/qr.util.js";

export const adminLogin = (email, password) => {
  const user = db
    .prepare(
      `
    SELECT * FROM users
    WHERE email = ? AND is_active = 1
    `,
    )
    .get(email);

  if (!user) throw new AppError(401, "Email hoặc mật khẩu không đúng");

  const matchPassword = comparePassword(password, user.password);

  if (!matchPassword) throw new AppError(401, "Email hoặc mật khẩu không đúng");

  let trainerProfile = null;
  if (user.role === "pt") {
    trainerProfile = db
      .prepare(
        `
        SELECT * FROM trainers
        WHERE user_id = ? AND deleted_at IS NULL
      `,
      )
      .get(user.id);
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  const { password: _, ...userWithoutPassword } = user;
  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
    trainerProfile,
  };
};

export const memberLogin = (email, password) => {
  const member = db
    .prepare(
      `
    SELECT * FROM members
    WHERE email = ? AND is_active = 1 AND deleted_at IS NULL
    `,
    )
    .get(email);

  if (!member) throw new AppError(401, "Email hoặc mật khẩu không đúng");

  const matchPassword = comparePassword(password, member.password);

  if (!matchPassword) throw new AppError(401, "Email hoặc mật khẩu không đúng");

  const accessToken = signAccessToken({ id: member.id, role: "member" });
  const refreshToken = generateRefreshToken({ memberId: member.id });

  const { password: _, ...memberWithoutPassword } = member;

  return {
    accessToken,
    refreshToken,
    member: memberWithoutPassword,
  };
};

export const memberRegister = (name, email, password) => {
  const existing = db
    .prepare(
      `
      SELECT id FROM members WHERE email = ? 
    `,
    )
    .get(email);

  if (existing) throw new AppError(409, "Email đã được sử dụng");

  const hashed = hashPassword(password);
  const qrCode = generateQrCode();

  const result = db
    .prepare(
      `
    INSERT INTO member (name, email, password, , qr_code)
    VALUES (?,?,?,?,?)
    `,
    )
    .run(name, email, hashed, qrCode);

  const member = db
    .prepare(
      `
        SELECT id, name, email, qr_code, create_at
        FROM members WHERE id = ?
      `,
    )
    .get(result.lastInsertRowid);

  const accessToken = signAccessToken({ id: member.id, role: "member" });
  const refreshToken = generateRefreshToken({ memberId: member.id });

  return { accessToken, refreshToken, member };
};
