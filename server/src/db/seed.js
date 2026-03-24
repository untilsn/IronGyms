// src/db/seed.js
import db from "../config/database.config.js";
import { hashPassword } from "../utils/hash.util.js";
import { generateQrCode } from "../utils/qr.util.js";

export default function seedData() {
  // chỉ seed khi chưa có data
  const hasData = db
    .prepare(
      `
    SELECT COUNT(*) as count FROM users
  `,
    )
    .get();

  if (hasData.count > 0) {
    console.log("⏭️  Seed đã chạy rồi, bỏ qua...");
    return;
  }

  // ==================== USERS ====================
  const adminId = db
    .prepare(
      `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(
      "Super Admin",
      "admin@irongyms.com",
      hashPassword("Admin@123"),
      "admin",
    ).lastInsertRowid;

  const staffId = db
    .prepare(
      `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(
      "Nguyen Van Staff",
      "staff@irongyms.com",
      hashPassword("Staff@123"),
      "staff",
    ).lastInsertRowid;

  const ptUserId = db
    .prepare(
      `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(
      "Tran Thi PT",
      "pt@irongyms.com",
      hashPassword("PT@123"),
      "pt",
    ).lastInsertRowid;

  // ==================== TRAINERS ====================
  const trainerId = db
    .prepare(
      `
    INSERT INTO trainers (user_id, specialty, bio, experience)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(
      ptUserId,
      "gym",
      "Chuyên gia thể hình với 5 năm kinh nghiệm",
      5,
    ).lastInsertRowid;

  // ==================== MEMBERS ====================
  const member1Id = db
    .prepare(
      `
    INSERT INTO members (name, email, password, phone, gender, qr_code)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    )
    .run(
      "Nguyen Van A",
      "member1@gmail.com",
      hashPassword("Member@123"),
      "0901234567",
      "male",
      generateQrCode(),
    ).lastInsertRowid;

  const member2Id = db
    .prepare(
      `
    INSERT INTO members (name, email, password, phone, gender, qr_code)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    )
    .run(
      "Tran Thi B",
      "member2@gmail.com",
      hashPassword("Member@123"),
      "0907654321",
      "female",
      generateQrCode(),
    ).lastInsertRowid;

  // ==================== MEMBERSHIP PLANS ====================
  const plan1Id = db
    .prepare(
      `
    INSERT INTO membership_plans (name, price, duration_days, description)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(
      "Gói 1 tháng",
      300000,
      30,
      "Tập không giới hạn trong 1 tháng",
    ).lastInsertRowid;

  const plan2Id = db
    .prepare(
      `
    INSERT INTO membership_plans (name, price, duration_days, description)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(
      "Gói 3 tháng",
      800000,
      90,
      "Tiết kiệm hơn gói 1 tháng",
    ).lastInsertRowid;

  const plan3Id = db
    .prepare(
      `
    INSERT INTO membership_plans (name, price, duration_days, description)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(
      "Gói 1 năm",
      2500000,
      365,
      "Tiết kiệm nhất, tập cả năm",
    ).lastInsertRowid;

  // ==================== PT PACKAGES ====================
  db.prepare(
    `
    INSERT INTO pt_packages (name, price, sessions, description)
    VALUES (?, ?, ?, ?)
  `,
  ).run("Gói 5 buổi PT", 500000, 5, "5 buổi tập cùng PT chuyên nghiệp");

  db.prepare(
    `
    INSERT INTO pt_packages (name, price, sessions, description)
    VALUES (?, ?, ?, ?)
  `,
  ).run("Gói 10 buổi PT", 900000, 10, "Tiết kiệm hơn gói 5 buổi");

  // ==================== VOUCHERS ====================
  db.prepare(
    `
    INSERT INTO vouchers
      (code, type, value, min_order, max_uses, start_date, end_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    "NEWMEMBER",
    "percent",
    10,
    0,
    100,
    "2025-01-01",
    "2025-12-31",
    adminId,
  );

  db.prepare(
    `
    INSERT INTO vouchers
      (code, type, value, min_order, max_uses, start_date, end_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    "GIAM50K",
    "fixed",
    50000,
    200000,
    50,
    "2025-01-01",
    "2025-12-31",
    adminId,
  );

  // ==================== CLASS CATEGORIES ====================
  db.prepare(
    `
    INSERT INTO class_categories (name, slug, color)
    VALUES (?, ?, ?)
  `,
  ).run("Yoga", "yoga", "#4CAF50");

  db.prepare(
    `
    INSERT INTO class_categories (name, slug, color)
    VALUES (?, ?, ?)
  `,
  ).run("Boxing", "boxing", "#F44336");

  db.prepare(
    `
    INSERT INTO class_categories (name, slug, color)
    VALUES (?, ?, ?)
  `,
  ).run("Zumba", "zumba", "#9C27B0");

  // ==================== CLASSES ====================
  db.prepare(
    `
    INSERT INTO classes
      (name, trainer_id, scheduled_at, duration_minutes, max_capacity, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run("Yoga cơ bản", trainerId, "2025-06-01 07:00:00", 60, 20, adminId);

  db.prepare(
    `
    INSERT INTO classes
      (name, trainer_id, scheduled_at, duration_minutes, max_capacity, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run("Boxing nâng cao", trainerId, "2025-06-01 09:00:00", 90, 15, adminId);

  console.log("✅ Seed data created successfully");
  console.log("----------------------------");
  console.log("🔑 Admin:  admin@irongyms.com / Admin@123");
  console.log("🔑 Staff:  staff@irongyms.com / Staff@123");
  console.log("🔑 PT:     pt@irongyms.com    / PT@123");
  console.log("🔑 Member: member1@gmail.com  / Member@123");
}
