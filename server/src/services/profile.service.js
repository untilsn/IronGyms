import db from '../config/database.config.js';
import { comparePassword, hashPassword } from '../utils/hash.util.js';
import AppError from '../utils/error.util.js';

// ==================== GET PROFILE ====================
export const getProfile = (id, role) => {
  // member → query bảng members
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
    return { ...member, role };
  }

  // admin, staff → query bảng users
  const user = db
    .prepare(
      `
    SELECT id, name, email, role, avatar,
           is_active, created_at
    FROM users
    WHERE id = ? AND is_active = 1
  `
    )
    .get(id);

  if (!user) throw new AppError(404, 'Không tìm thấy tài khoản');

  // pt → lấy thêm trainer profile
  if (role === 'pt') {
    const trainer = db
      .prepare(
        `
      SELECT id, specialty, bio, experience
      FROM trainers
      WHERE user_id = ? AND deleted_at IS NULL
    `
      )
      .get(id);
    return { ...user, trainerProfile: trainer };
  }

  return user;
};

// ==================== UPDATE PROFILE ====================
export const updateProfile = (id, role, data) => {
  if (role === 'member') {
    return updateMemberProfile(id, data);
  }

  updateUserProfile(id, data);

  if (role === 'pt') {
    updateTrainerProfile(id, data);
  }

  return getProfile(id, role);
};

// ── helpers ──────────────────────────────────────────────

const updateMemberProfile = (id, data) => {
  // chỉ lấy đúng field member được phép update
  const allowed = ['name', 'phone', 'gender', 'birthday'];
  const fields = buildUpdateFields(data, allowed);

  if (fields.setClauses.length === 0) {
    throw new AppError(400, 'Không có dữ liệu cần cập nhật');
  }

  db.prepare(
    `
    UPDATE members
    SET ${fields.setClauses.join(', ')}, updated_at = datetime('now')
    WHERE id = ? AND deleted_at IS NULL
  `
  ).run(...fields.values, id);

  return getProfile(id, 'member');
};

const updateUserProfile = (id, data) => {
  const allowed = ['name'];
  const fields = buildUpdateFields(data, allowed);

  if (fields.setClauses.length === 0) return; // pt có thể chỉ update trainer profile

  db.prepare(
    `
    UPDATE users
    SET ${fields.setClauses.join(', ')}, updated_at = datetime('now')
    WHERE id = ? AND is_active = 1
  `
  ).run(...fields.values, id);
};

const updateTrainerProfile = (userId, data) => {
  const allowed = ['specialty', 'bio', 'experience'];
  const fields = buildUpdateFields(data, allowed);

  if (fields.setClauses.length === 0) return;

  db.prepare(
    `
    UPDATE trainers
    SET ${fields.setClauses.join(', ')}, updated_at = datetime('now')
    WHERE user_id = ?
  `
  ).run(...fields.values, userId);
};

// chỉ build SET clause cho những field client thực sự gửi lên
// bỏ qua field undefined hoặc null
const buildUpdateFields = (data, allowedFields) => {
  const setClauses = [];
  const values = [];

  for (const field of allowedFields) {
    // undefined  → client không gửi field này → bỏ qua
    // null       → client muốn xoá field → cho phép (trừ name)
    if (data[field] === undefined) continue;

    setClauses.push(`${field} = ?`);
    values.push(data[field]);
  }

  return { setClauses, values };
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = (id, role, oldPassword, newPassword) => {
  const table = role === 'member' ? 'members' : 'users';

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

  // không cho đổi sang mật khẩu giống cũ
  const isSame = comparePassword(newPassword, record.password);
  if (isSame) throw new AppError(400, 'Mật khẩu mới không được trùng mật khẩu cũ');

  db.prepare(
    `
    UPDATE ${table}
    SET password   = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(hashPassword(newPassword), id);

  return { message: 'Đổi mật khẩu thành công' };
};
