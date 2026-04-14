// src/db/seed.js
import db from '../config/database.config.js';
import { hashPassword } from '../utils/hash.util.js';
import { generateQrCode } from '../utils/qr.util.js';

export default function seedData() {
  // chỉ seed khi chưa có data
  const hasData = db.prepare(`SELECT COUNT(*) as count FROM users`).get();

  if (hasData.count > 0) {
    console.log('⏭️  Seed đã chạy rồi, bỏ qua...');
    return;
  }

  // ==================== USERS ====================
  const adminId = db
    .prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`)
    .run('Super Admin', 'admin@irongyms.com', hashPassword('Admin@123'), 'admin').lastInsertRowid;

  const staffId = db
    .prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`)
    .run(
      'Nguyen Van Staff',
      'staff@irongyms.com',
      hashPassword('Staff@123'),
      'staff'
    ).lastInsertRowid;

  const ptUserId = db
    .prepare(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`)
    .run('Tran Thi PT', 'pt@irongyms.com', hashPassword('PT@123'), 'pt').lastInsertRowid;

  // ==================== TRAINERS ====================
  const trainerId = db
    .prepare(`INSERT INTO trainers (user_id, specialty, bio, experience) VALUES (?, ?, ?, ?)`)
    .run(ptUserId, 'gym', 'Chuyên gia thể hình với 5 năm kinh nghiệm', 5).lastInsertRowid;

  // ==================== MEMBERS ====================
  const member1Id = db
    .prepare(
      `INSERT INTO members (name, email, password, phone, gender, qr_code) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      'Nguyen Van A',
      'member1@gmail.com',
      hashPassword('Member@123'),
      '0901234567',
      'male',
      generateQrCode()
    ).lastInsertRowid;

  const member2Id = db
    .prepare(
      `INSERT INTO members (name, email, password, phone, gender, qr_code) VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      'Tran Thi B',
      'member2@gmail.com',
      hashPassword('Member@123'),
      '0907654321',
      'female',
      generateQrCode()
    ).lastInsertRowid;

  // ==================== MEMBERSHIP PLANS ====================
  const plan1Id = db
    .prepare(
      `INSERT INTO membership_plans (name, price, duration_days, description) VALUES (?, ?, ?, ?)`
    )
    .run('Gói 1 tháng', 300000, 30, 'Tập không giới hạn trong 1 tháng').lastInsertRowid;

  const plan2Id = db
    .prepare(
      `INSERT INTO membership_plans (name, price, duration_days, description) VALUES (?, ?, ?, ?)`
    )
    .run('Gói 3 tháng', 800000, 90, 'Tiết kiệm hơn gói 1 tháng').lastInsertRowid;

  const plan3Id = db
    .prepare(
      `INSERT INTO membership_plans (name, price, duration_days, description) VALUES (?, ?, ?, ?)`
    )
    .run('Gói 1 năm', 2500000, 365, 'Tiết kiệm nhất, tập cả năm').lastInsertRowid;

  // ==================== PT PACKAGES ====================
  const ptPackage1Id = db
    .prepare(`INSERT INTO pt_packages (name, price, sessions, description) VALUES (?, ?, ?, ?)`)
    .run('Gói 5 buổi PT', 500000, 5, '5 buổi tập cùng PT chuyên nghiệp').lastInsertRowid;

  const ptPackage2Id = db
    .prepare(`INSERT INTO pt_packages (name, price, sessions, description) VALUES (?, ?, ?, ?)`)
    .run('Gói 10 buổi PT', 900000, 10, 'Tiết kiệm hơn gói 5 buổi').lastInsertRowid;

  // ==================== VOUCHERS ====================
  const voucher1Id = db
    .prepare(
      `INSERT INTO vouchers (code, type, value, min_order, max_uses, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run('NEWMEMBER', 'percent', 10, 0, 100, '2025-01-01', '2025-12-31', adminId).lastInsertRowid;

  const voucher2Id = db
    .prepare(
      `INSERT INTO vouchers (code, type, value, min_order, max_uses, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      'GIAM50K',
      'fixed',
      50000,
      200000,
      50,
      '2025-01-01',
      '2025-12-31',
      adminId
    ).lastInsertRowid;

  // ==================== CLASS CATEGORIES ====================
  // không có slug — class_categories là data nội bộ, không có public URL
  const catYogaId = db
    .prepare(`INSERT INTO class_categories (name, color) VALUES (?, ?)`)
    .run('Yoga', '#4CAF50').lastInsertRowid;

  const catBoxingId = db
    .prepare(`INSERT INTO class_categories (name, color) VALUES (?, ?)`)
    .run('Boxing', '#F44336').lastInsertRowid;

  const catZumbaId = db
    .prepare(`INSERT INTO class_categories (name, color) VALUES (?, ?)`)
    .run('Zumba', '#9C27B0').lastInsertRowid;

  // ==================== CLASSES ====================
  db.prepare(
    `INSERT INTO classes (name, category_id, trainer_id, scheduled_at, duration_minutes, max_capacity, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run('Yoga cơ bản', catYogaId, trainerId, '2025-06-01 07:00:00', 60, 20, adminId);

  db.prepare(
    `INSERT INTO classes (name, category_id, trainer_id, scheduled_at, duration_minutes, max_capacity, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run('Boxing nâng cao', catBoxingId, trainerId, '2025-06-01 09:00:00', 90, 15, adminId);

  // ==================== MEMBER MEMBERSHIPS ====================
  const membership1Id = db
    .prepare(
      `INSERT INTO member_memberships
        (member_id, plan_id, original_price, final_price, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(member1Id, plan1Id, 300000, 300000, '2025-06-01', '2025-07-01', staffId).lastInsertRowid;

  const membership2Id = db
    .prepare(
      `INSERT INTO member_memberships
        (member_id, plan_id, voucher_id, original_price, final_price, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      member2Id,
      plan2Id,
      voucher1Id,
      800000,
      720000,
      '2025-06-01',
      '2025-09-01',
      staffId
    ).lastInsertRowid;

  // ==================== MEMBER PT PACKAGES ====================
  const memberPtId = db
    .prepare(
      `INSERT INTO member_pt_packages
        (member_id, pt_package_id, trainer_id, original_price, final_price, sessions_remaining, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(member1Id, ptPackage1Id, trainerId, 500000, 500000, 5, staffId).lastInsertRowid;

  // ==================== PAYMENTS ====================
  db.prepare(
    `INSERT INTO payments (member_id, type, reference_id, amount, method, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(member1Id, 'membership', membership1Id, 300000, 'cash', staffId);

  db.prepare(
    `INSERT INTO payments (member_id, type, reference_id, amount, method, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(member2Id, 'membership', membership2Id, 720000, 'transfer', staffId);

  db.prepare(
    `INSERT INTO payments (member_id, type, reference_id, amount, method, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(member1Id, 'pt_package', memberPtId, 500000, 'cash', staffId);

  // ==================== CHECK INS ====================
  db.prepare(
    `INSERT INTO check_ins (member_id, membership_id, is_valid, created_by) VALUES (?, ?, ?, ?)`
  ).run(member1Id, membership1Id, 1, staffId);

  db.prepare(
    `INSERT INTO check_ins (member_id, membership_id, is_valid, created_by) VALUES (?, ?, ?, ?)`
  ).run(member2Id, membership2Id, 1, staffId);

  // ==================== BLOG CATEGORIES ====================
  const blogCat1Id = db
    .prepare(`INSERT INTO blog_categories (name, slug) VALUES (?, ?)`)
    .run('Dinh dưỡng', 'dinh-duong').lastInsertRowid;

  const blogCat2Id = db
    .prepare(`INSERT INTO blog_categories (name, slug) VALUES (?, ?)`)
    .run('Tập luyện', 'tap-luyen').lastInsertRowid;

  // ==================== BLOGS ====================
  db.prepare(
    `INSERT INTO blogs (title, slug, excerpt, content, category_id, author_id, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    'Top 5 thực phẩm tăng cơ hiệu quả',
    'top-5-thuc-pham-tang-co',
    'Chế độ dinh dưỡng đúng là chìa khóa để tăng cơ nhanh chóng.',
    'Nội dung đầy đủ về dinh dưỡng tăng cơ...',
    blogCat1Id,
    ptUserId,
    'published',
    '2025-06-01'
  );

  db.prepare(
    `INSERT INTO blogs (title, slug, excerpt, content, category_id, author_id, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    'Bài tập cardio cho người mới bắt đầu',
    'bai-tap-cardio-nguoi-moi',
    'Cardio đúng cách giúp đốt mỡ và tăng sức bền hiệu quả.',
    'Nội dung đầy đủ về cardio cho người mới...',
    blogCat2Id,
    ptUserId,
    'published',
    '2025-06-02'
  );

  console.log('✅ Seed data created successfully');
  console.log('----------------------------');
  console.log('🔑 Admin:  admin@irongyms.com  / Admin@123');
  console.log('🔑 Staff:  staff@irongyms.com  / Staff@123');
  console.log('🔑 PT:     pt@irongyms.com     / PT@123');
  console.log('🔑 Member: member1@gmail.com   / Member@123');
}
