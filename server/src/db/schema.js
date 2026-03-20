import db from "../config/database.config.js";

export default function createTables() {
  // ==================== USERS ====================
  // admin, staff, pt — đăng nhập admin web
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      email      TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      role       TEXT    NOT NULL DEFAULT 'staff',
      avatar     TEXT    DEFAULT NULL,
      is_active  INTEGER NOT NULL DEFAULT 1,
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_users_email
      ON users(email);
  `);

  // ==================== MEMBERS ====================
  // hội viên — đăng nhập client web
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL,
      email      TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      phone      TEXT    DEFAULT NULL,
      avatar     TEXT    DEFAULT NULL,
      gender     TEXT    DEFAULT NULL,
      birthday   TEXT    DEFAULT NULL,
      qr_code    TEXT    NOT NULL UNIQUE,
      is_active  INTEGER NOT NULL DEFAULT 1,
      deleted_at TEXT    DEFAULT NULL,
      created_by INTEGER DEFAULT NULL REFERENCES users(id),
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_members_email
      ON members(email);
    CREATE INDEX IF NOT EXISTS idx_members_qr
      ON members(qr_code);
    CREATE INDEX IF NOT EXISTS idx_members_deleted
      ON members(deleted_at);
  `);

  // ==================== TRAINERS ====================
  // profile PT — liên kết 1-1 với users (role = 'pt')
  db.exec(`
    CREATE TABLE IF NOT EXISTS trainers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL UNIQUE REFERENCES users(id),
      specialty  TEXT    DEFAULT NULL,
      bio        TEXT    DEFAULT NULL,
      experience INTEGER DEFAULT 0,
      deleted_at TEXT    DEFAULT NULL,
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_trainers_user
      ON trainers(user_id);
    CREATE INDEX IF NOT EXISTS idx_trainers_deleted
      ON trainers(deleted_at);
  `);

  // ==================== TOKENS ====================
  // lưu refresh token, verify email, forgot password
  db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER DEFAULT NULL REFERENCES users(id),
      member_id  INTEGER DEFAULT NULL REFERENCES members(id),
      type       TEXT    NOT NULL,
      token      TEXT    NOT NULL UNIQUE,
      expires_at TEXT    NOT NULL,
      created_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_tokens_token
      ON tokens(token);
    CREATE INDEX IF NOT EXISTS idx_tokens_type
      ON tokens(type);
    CREATE INDEX IF NOT EXISTS idx_tokens_expires
      ON tokens(expires_at);
  `);

  // ==================== CLASS CATEGORIES ====================
  // phân loại lớp học — Yoga, Boxing, Zumba...
  db.exec(`
    CREATE TABLE IF NOT EXISTS class_categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL UNIQUE,
      color      TEXT    DEFAULT NULL,
      is_active  INTEGER DEFAULT 1,
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now'))
    );
  `);

  // ==================== MEMBERSHIP PLANS ====================
  // gói gym theo thời hạn
  db.exec(`
    CREATE TABLE IF NOT EXISTS membership_plans (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      description   TEXT    DEFAULT NULL,
      price         REAL    NOT NULL,
      duration_days INTEGER NOT NULL,
      class_limit   INTEGER DEFAULT -1,
      is_active     INTEGER DEFAULT 1,
      created_at    TEXT    DEFAULT (datetime('now')),
      updated_at    TEXT    DEFAULT (datetime('now'))
    );
  `);

  // ==================== PT PACKAGES ====================
  // gói PT theo số buổi
  db.exec(`
    CREATE TABLE IF NOT EXISTS pt_packages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      description TEXT    DEFAULT NULL,
      price       REAL    NOT NULL,
      sessions    INTEGER NOT NULL,
      is_active   INTEGER DEFAULT 1,
      created_at  TEXT    DEFAULT (datetime('now')),
      updated_at  TEXT    DEFAULT (datetime('now'))
    );
  `);

  // ==================== VOUCHERS ====================
  // mã giảm giá
  db.exec(`
    CREATE TABLE IF NOT EXISTS vouchers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      code       TEXT    NOT NULL UNIQUE,
      type       TEXT    NOT NULL,
      value      REAL    NOT NULL,
      min_order  REAL    DEFAULT 0,
      max_uses   INTEGER DEFAULT NULL,
      used_count INTEGER DEFAULT 0,
      start_date TEXT    NOT NULL,
      end_date   TEXT    NOT NULL,
      is_active  INTEGER DEFAULT 1,
      created_by INTEGER DEFAULT NULL REFERENCES users(id),
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_vouchers_code
      ON vouchers(code);
    CREATE INDEX IF NOT EXISTS idx_vouchers_enddate
      ON vouchers(end_date);
  `);

  // ==================== MEMBER MEMBERSHIPS ====================
  // hội viên đã mua gói gym
  db.exec(`
    CREATE TABLE IF NOT EXISTS member_memberships (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id       INTEGER NOT NULL REFERENCES members(id),
      plan_id         INTEGER NOT NULL REFERENCES membership_plans(id),
      voucher_id      INTEGER DEFAULT NULL REFERENCES vouchers(id),
      original_price  REAL    NOT NULL,
      final_price     REAL    NOT NULL,
      start_date      TEXT    NOT NULL,
      end_date        TEXT    NOT NULL,
      class_remaining INTEGER DEFAULT -1,
      status          TEXT    DEFAULT 'active',
      note            TEXT    DEFAULT NULL,
      created_by      INTEGER DEFAULT NULL REFERENCES users(id),
      created_at      TEXT    DEFAULT (datetime('now')),
      updated_at      TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_member_memberships_member
      ON member_memberships(member_id);
    CREATE INDEX IF NOT EXISTS idx_member_memberships_status
      ON member_memberships(status);
    CREATE INDEX IF NOT EXISTS idx_member_memberships_enddate
      ON member_memberships(end_date);
  `);

  // ==================== MEMBER PT PACKAGES ====================
  // hội viên đã mua gói PT
  db.exec(`
    CREATE TABLE IF NOT EXISTS member_pt_packages (
      id                 INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id          INTEGER NOT NULL REFERENCES members(id),
      pt_package_id      INTEGER NOT NULL REFERENCES pt_packages(id),
      trainer_id         INTEGER DEFAULT NULL REFERENCES trainers(id),
      voucher_id         INTEGER DEFAULT NULL REFERENCES vouchers(id),
      original_price     REAL    NOT NULL,
      final_price        REAL    NOT NULL,
      sessions_remaining INTEGER NOT NULL,
      status             TEXT    DEFAULT 'active',
      note               TEXT    DEFAULT NULL,
      created_by         INTEGER DEFAULT NULL REFERENCES users(id),
      created_at         TEXT    DEFAULT (datetime('now')),
      updated_at         TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_member_pt_packages_member
      ON member_pt_packages(member_id);
    CREATE INDEX IF NOT EXISTS idx_member_pt_packages_status
      ON member_pt_packages(status);
    CREATE INDEX IF NOT EXISTS idx_member_pt_packages_trainer
      ON member_pt_packages(trainer_id);
  `);

  // ==================== PAYMENTS ====================
  // lịch sử thanh toán
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id    INTEGER NOT NULL REFERENCES members(id),
      type         TEXT    NOT NULL,
      reference_id INTEGER NOT NULL,
      amount       REAL    NOT NULL,
      method       TEXT    NOT NULL,
      status       TEXT    DEFAULT 'completed',
      note         TEXT    DEFAULT NULL,
      created_by   INTEGER DEFAULT NULL REFERENCES users(id),
      created_at   TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_payments_member
      ON payments(member_id);
    CREATE INDEX IF NOT EXISTS idx_payments_type
      ON payments(type);
    CREATE INDEX IF NOT EXISTS idx_payments_created
      ON payments(created_at);
  `);

  // ==================== CLASSES ====================
  // lớp học nhóm
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      name             TEXT    NOT NULL,
      description      TEXT    DEFAULT NULL,
      category_id      INTEGER DEFAULT NULL REFERENCES class_categories(id),
      trainer_id       INTEGER DEFAULT NULL REFERENCES trainers(id),
      scheduled_at     TEXT    NOT NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      max_capacity     INTEGER NOT NULL DEFAULT 20,
      status           TEXT    DEFAULT 'scheduled',
      created_by       INTEGER DEFAULT NULL REFERENCES users(id),
      created_at       TEXT    DEFAULT (datetime('now')),
      updated_at       TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_classes_category
      ON classes(category_id);
    CREATE INDEX IF NOT EXISTS idx_classes_trainer
      ON classes(trainer_id);
    CREATE INDEX IF NOT EXISTS idx_classes_scheduled
      ON classes(scheduled_at);
    CREATE INDEX IF NOT EXISTS idx_classes_status
      ON classes(status);
  `);

  // ==================== CLASS BOOKINGS ====================
  // hội viên đặt lớp học
  db.exec(`
    CREATE TABLE IF NOT EXISTS class_bookings (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id  INTEGER NOT NULL REFERENCES members(id),
      class_id   INTEGER NOT NULL REFERENCES classes(id),
      status     TEXT    DEFAULT 'booked',
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now')),
      UNIQUE(member_id, class_id)
    );
    CREATE INDEX IF NOT EXISTS idx_class_bookings_member
      ON class_bookings(member_id);
    CREATE INDEX IF NOT EXISTS idx_class_bookings_class
      ON class_bookings(class_id);
    CREATE INDEX IF NOT EXISTS idx_class_bookings_status
      ON class_bookings(status);
  `);

  // ==================== PT BOOKINGS ====================
  // hội viên đặt lịch tập 1-1 với PT
  db.exec(`
    CREATE TABLE IF NOT EXISTS pt_bookings (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id            INTEGER NOT NULL REFERENCES members(id),
      trainer_id           INTEGER NOT NULL REFERENCES trainers(id),
      member_pt_package_id INTEGER DEFAULT NULL REFERENCES member_pt_packages(id),
      scheduled_at         TEXT    NOT NULL,
      duration_minutes     INTEGER DEFAULT 60,
      status               TEXT    DEFAULT 'scheduled',
      note                 TEXT    DEFAULT NULL,
      created_at           TEXT    DEFAULT (datetime('now')),
      updated_at           TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pt_bookings_member
      ON pt_bookings(member_id);
    CREATE INDEX IF NOT EXISTS idx_pt_bookings_trainer
      ON pt_bookings(trainer_id);
    CREATE INDEX IF NOT EXISTS idx_pt_bookings_scheduled
      ON pt_bookings(scheduled_at);
    CREATE INDEX IF NOT EXISTS idx_pt_bookings_status
      ON pt_bookings(status);
  `);

  // ==================== CHECK INS ====================
  // lịch sử vào gym bằng QR
  db.exec(`
    CREATE TABLE IF NOT EXISTS check_ins (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id     INTEGER NOT NULL REFERENCES members(id),
      membership_id INTEGER DEFAULT NULL REFERENCES member_memberships(id),
      is_valid      INTEGER DEFAULT 1,
      note          TEXT    DEFAULT NULL,
      checked_in_at TEXT    DEFAULT (datetime('now')),
      created_by    INTEGER DEFAULT NULL REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_check_ins_member
      ON check_ins(member_id);
    CREATE INDEX IF NOT EXISTS idx_check_ins_date
      ON check_ins(checked_in_at);
    CREATE INDEX IF NOT EXISTS idx_check_ins_membership
      ON check_ins(membership_id);
  `);

  // ==================== NOTIFICATIONS ====================
  // thông báo cho member và user
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER DEFAULT NULL REFERENCES users(id),
      member_id  INTEGER DEFAULT NULL REFERENCES members(id),
      type       TEXT    NOT NULL,
      title      TEXT    NOT NULL,
      message    TEXT    NOT NULL,
      is_read    INTEGER DEFAULT 0,
      created_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_notifications_user
      ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_member
      ON notifications(member_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_read
      ON notifications(is_read);
  `);

  // ==================== CONVERSATIONS ====================
  // phòng chat giữa member và staff/pt
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id  INTEGER NOT NULL REFERENCES members(id),
      user_id    INTEGER DEFAULT NULL REFERENCES users(id),
      status     TEXT    DEFAULT 'open',
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_conversations_member
      ON conversations(member_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_user
      ON conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_status
      ON conversations(status);
  `);

  // ==================== MESSAGES ====================
  // tin nhắn trong phòng chat
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id),
      sender_type     TEXT    NOT NULL,
      sender_id       INTEGER NOT NULL,
      content         TEXT    NOT NULL,
      is_read         INTEGER DEFAULT 0,
      created_at      TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_messages_conversation
      ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_messages_created
      ON messages(created_at);
  `);

  // ==================== MEMBER METRICS ====================
  // chỉ số cơ thể của hội viên
  db.exec(`
    CREATE TABLE IF NOT EXISTS member_metrics (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id   INTEGER NOT NULL REFERENCES members(id),
      weight      REAL    DEFAULT NULL,
      height      REAL    DEFAULT NULL,
      bmi         REAL    DEFAULT NULL,
      body_fat    REAL    DEFAULT NULL,
      note        TEXT    DEFAULT NULL,
      recorded_at TEXT    DEFAULT (datetime('now')),
      created_by  INTEGER DEFAULT NULL REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_metrics_member
      ON member_metrics(member_id);
    CREATE INDEX IF NOT EXISTS idx_metrics_date
      ON member_metrics(recorded_at);
  `);

  // ==================== TRAINER REVIEWS ====================
  // đánh giá PT sau buổi tập
  db.exec(`
    CREATE TABLE IF NOT EXISTS trainer_reviews (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id  INTEGER NOT NULL REFERENCES members(id),
      trainer_id INTEGER NOT NULL REFERENCES trainers(id),
      rating     INTEGER NOT NULL,
      comment    TEXT    DEFAULT NULL,
      created_at TEXT    DEFAULT (datetime('now')),
      UNIQUE(member_id, trainer_id)
    );
    CREATE INDEX IF NOT EXISTS idx_reviews_trainer
      ON trainer_reviews(trainer_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_member
      ON trainer_reviews(member_id);
  `);

  // ==================== BLOG CATEGORIES ====================
  // danh mục bài viết
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL UNIQUE,
      slug       TEXT    NOT NULL UNIQUE,
      is_active  INTEGER DEFAULT 1,
      created_at TEXT    DEFAULT (datetime('now')),
      updated_at TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_blog_categories_slug
      ON blog_categories(slug);
  `);

  // ==================== BLOGS ====================
  // bài viết
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT    NOT NULL,
      slug         TEXT    NOT NULL UNIQUE,
      excerpt      TEXT    DEFAULT NULL,
      content      TEXT    NOT NULL,
      thumbnail    TEXT    DEFAULT NULL,
      category_id  INTEGER DEFAULT NULL REFERENCES blog_categories(id),
      author_id    INTEGER DEFAULT NULL REFERENCES users(id),
      status       TEXT    DEFAULT 'draft',
      views        INTEGER DEFAULT 0,
      published_at TEXT    DEFAULT NULL,
      deleted_at   TEXT    DEFAULT NULL,
      created_at   TEXT    DEFAULT (datetime('now')),
      updated_at   TEXT    DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_blogs_slug
      ON blogs(slug);
    CREATE INDEX IF NOT EXISTS idx_blogs_status
      ON blogs(status);
    CREATE INDEX IF NOT EXISTS idx_blogs_category
      ON blogs(category_id);
    CREATE INDEX IF NOT EXISTS idx_blogs_deleted
      ON blogs(deleted_at);
  `);

  console.log("✅ All 22 tables created successfully");
}

```
## Checklist 22 bảng
Nhóm người dùng (3)
  □ users
  □ members
  □ trainers

Nhóm token (1)
  □ tokens

Nhóm sản phẩm (4)
  □ class_categories
  □ membership_plans
  □ pt_packages
  □ vouchers

Nhóm giao dịch (3)
  □ member_memberships
  □ member_pt_packages
  □ payments

Nhóm lịch học (3)
  □ classes
  □ class_bookings
  □ pt_bookings

Nhóm hoạt động (2)
  □ check_ins
  □ notifications

Nhóm chat (2)
  □ conversations
  □ messages

Nhóm theo dõi (2)
  □ member_metrics
  □ trainer_reviews

Nhóm blog (2)
  □ blog_categories
  □ blogs

```;
