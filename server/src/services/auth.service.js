import db from '../config/database.config.js';
import {
  deleteRefreshToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../services/token.service.js';
import AppError from '../utils/error.util.js';
import { comparePassword, hashPassword } from '../utils/hash.util.js';
import { signAccessToken } from '../utils/jwt.util.js';
import { generateQrCode } from '../utils/qr.util.js';

export const adminLogin = (email, password) => {
  const user = db
    .prepare(
      `
    SELECT * FROM users
    WHERE email = ? AND is_active = 1
    `
    )
    .get(email);

  if (!user) throw new AppError(401, 'Email hoặc mật khẩu không đúng');

  const matchPassword = comparePassword(password, user.password);

  if (!matchPassword) throw new AppError(401, 'Email hoặc mật khẩu không đúng');

  let trainerProfile = null;
  if (user.role === 'pt') {
    trainerProfile = db
      .prepare(
        `
        SELECT * FROM trainers
        WHERE user_id = ? AND deleted_at IS NULL
      `
      )
      .get(user.id);
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

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
    `
    )
    .get(email);

  if (!member) throw new AppError(401, 'Email hoặc mật khẩu không đúng');

  const matchPassword = comparePassword(password, member.password);

  if (!matchPassword) throw new AppError(401, 'Email hoặc mật khẩu không đúng');

  const accessToken = signAccessToken({ id: member.id, role: 'member' });
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
    `
    )
    .get(email);

  if (existing) throw new AppError(409, 'Email đã được sử dụng');

  const hashed = hashPassword(password);
  const qrCode = generateQrCode();

  const result = db
    .prepare(
      `
    INSERT INTO members (name, email, password, qr_code)
    VALUES (?,?,?,?)
    `
    )
    .run(name, email, hashed, qrCode);

  const member = db
    .prepare(
      `
        SELECT id, name, email, qr_code, created_at
        FROM members WHERE id = ?
      `
    )
    .get(result.lastInsertRowid);

  const accessToken = signAccessToken({ id: member.id, role: 'member' });
  const refreshToken = generateRefreshToken({ memberId: member.id });

  return { accessToken, refreshToken, member };
};

// ==================== REFRESH TOKEN ====================
// lấy access token mới khi hết hạn
export const refreshAccessToken = refreshToken => {
  if (!refreshToken) throw new AppError(401, 'Vui lòng đăng nhập lại');

  // verify refresh token từ db
  const record = verifyRefreshToken(refreshToken);
  if (!record) throw new AppError(401, 'Phiên đăng nhập đã hết hạn');

  // xác định payload cho access token mới
  let payload;
  console.log('recode', record);
  if (record.user_id) {
    // là admin/staff/pt → lấy role từ db
    const user = db
      .prepare(
        `
      SELECT id, role FROM users WHERE id = ? AND is_active = 1
    `
      )
      .get(record.user_id);

    if (!user) throw new AppError(401, 'Tài khoản không tồn tại');
    payload = { id: user.id, role: user.role };
  } else {
    // là member
    const member = db
      .prepare(
        `
      SELECT id FROM members
      WHERE id = ? AND is_active = 1 AND deleted_at IS NULL
    `
      )
      .get(record.member_id);

    if (!member) throw new AppError(401, 'Tài khoản không tồn tại');
    payload = { id: member.id, role: 'member' };
  }

  // tạo access token mới
  const accessToken = signAccessToken(payload);
  return { accessToken };
};

// ==================== LOGOUT ====================
// xóa refresh token khỏi db
export const logout = refreshToken => {
  if (refreshToken) {
    deleteRefreshToken(refreshToken);
  }
  return { message: 'Đăng xuất thành công' };
};

// ==================== GET ME ====================
// lấy thông tin người dùng đang đăng nhập
export const getMe = (id, role) => {
  // member
  if (role === 'member') {
    const member = db
      .prepare(
        `
      SELECT id, name, email, phone, avatar,
             gender, birthday, qr_code,
             is_active, created_at
      FROM members
      WHERE id = ? AND deleted_at IS NULL
    `
      )
      .get(id);

    if (!member) throw new AppError(404, 'Không tìm thấy tài khoản');
    return { ...member, role: 'member' };
  }

  // admin, staff, pt
  const user = db
    .prepare(
      `
    SELECT id, name, email, role, avatar, is_active, created_at
    FROM users
    WHERE id = ? AND is_active = 1
  `
    )
    .get(id);

  if (!user) throw new AppError(404, 'Không tìm thấy tài khoản');

  // nếu là PT → lấy thêm trainer profile
  if (role === 'pt') {
    const trainerProfile = db
      .prepare(
        `
      SELECT * FROM trainers
      WHERE user_id = ? AND deleted_at IS NULL
    `
      )
      .get(id);
    return { ...user, trainerProfile };
  }

  return user;
};

// ==================== CHANGE PASSWORD ====================
// đổi mật khẩu — yêu cầu nhập mật khẩu cũ
export const changePassword = (id, role, oldPassword, newPassword) => {
  const table = role === 'member' ? 'members' : 'users';

  // lấy password hiện tại
  const record = db
    .prepare(
      `
    SELECT password FROM ${table} WHERE id = ?
  `
    )
    .get(id);

  if (!record) throw new AppError(404, 'Không tìm thấy tài khoản');

  // kiểm tra mật khẩu cũ
  const isMatch = comparePassword(oldPassword, record.password);
  if (!isMatch) throw new AppError(401, 'Mật khẩu cũ không đúng');

  // kiểm tra mật khẩu mới không trùng cũ
  const isSame = comparePassword(newPassword, record.password);
  if (isSame) throw new AppError(400, 'Mật khẩu mới không được trùng mật khẩu cũ');

  // hash và cập nhật
  db.prepare(
    `
    UPDATE ${table}
    SET password = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(hashPassword(newPassword), id);

  return { message: 'Đổi mật khẩu thành công' };
};

// ==================== FORGOT PASSWORD ====================
// gửi link reset password qua email
export const forgotPassword = email => {
  // tìm trong cả 2 bảng
  const user = db
    .prepare(
      `
    SELECT id, 'user' as type FROM users
    WHERE email = ? AND is_active = 1
  `
    )
    .get(email);

  const member =
    !user &&
    db
      .prepare(
        `
    SELECT id, 'member' as type FROM members
    WHERE email = ? AND is_active = 1 AND deleted_at IS NULL
  `
      )
      .get(email);

  const account = user || member;

  // không báo lỗi dù không tìm thấy — tránh lộ thông tin
  if (!account) {
    return { message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn' };
  }

  // tạo forgot password token
  const token =
    account.type === 'user'
      ? generateForgotPasswordToken({ userId: account.id })
      : generateForgotPasswordToken({ memberId: account.id });

  // TODO: gửi email kèm link reset
  // await sendResetPasswordEmail(email, token);
  // link: `${CLIENT_URL}/reset-password?token=${token}`

  // dev mode — trả token để test
  const isDev = process.env.NODE_ENV === 'development';
  return {
    message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn',
    ...(isDev && { token }), // chỉ trả token khi dev
  };
};

// ==================== RESET PASSWORD ====================
// đặt lại mật khẩu bằng token
export const resetPassword = (token, newPassword) => {
  // verify token từ db — tự xóa sau khi dùng
  const record = verifyForgotPasswordToken(token);
  if (!record) throw new AppError(400, 'Token không hợp lệ hoặc đã hết hạn');

  const table = record.user_id ? 'users' : 'members';
  const id = record.user_id || record.member_id;

  // cập nhật mật khẩu mới
  db.prepare(
    `
    UPDATE ${table}
    SET password = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(hashPassword(newPassword), id);

  return { message: 'Đặt lại mật khẩu thành công' };
};
