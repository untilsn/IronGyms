import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  isAdmin,
  isAdminOrStaff,
  isAdminOrPT,
  isMember,
} from "../middlewares/role.middleware.js";

// import tất cả routers
import authRouter from "./modules/auth.router.js";
import userRouter from "./modules/user.router.js";
import memberRouter from "./modules/member.router.js";
import trainerRouter from "./modules/trainer.router.js";
import membershipPlanRouter from "./modules/membership-plan.router.js";
import ptPackageRouter from "./modules/pt-package.router.js";
import voucherRouter from "./modules/voucher.router.js";
import memberMembershipRouter from "./modules/member-membership.router.js";
import memberPtPackageRouter from "./modules/member-pt-package.router.js";
import paymentRouter from "./modules/payment.router.js";
import classRouter from "./modules/class.router.js";
import classBookingRouter from "./modules/class-booking.router.js";
import ptBookingRouter from "./modules/pt-booking.router.js";
import equipmentRouter from "./modules/equipment.router.js";
import announcementRouter from "./modules/announcement.router.js";
import checkInRouter from "./modules/check-in.router.js";
import notificationRouter from "./modules/notification.router.js";
import conversationRouter from "./modules/conversation.router.js";
import memberMetricRouter from "./modules/member-metric.router.js";
import trainerReviewRouter from "./modules/trainer-review.router.js";
import blogCategoryRouter from "./modules/blog-category.router.js";
import blogRouter from "./modules/blog.router.js";

const router = Router();

// ==================== PUBLIC ====================
// không cần đăng nhập
router.use("/auth", authRouter);
router.use("/blogs", blogRouter); // đọc blog public
router.use("/announcements", announcementRouter); // đọc thông báo public

// ==================== ADMIN ONLY ====================
// chỉ admin
router.use("/users", authenticate, isAdmin, userRouter);
router.use("/equipment", authenticate, isAdmin, equipmentRouter);

// ==================== ADMIN + STAFF ====================
// admin + staff
router.use("/members", authenticate, isAdminOrStaff, memberRouter);
router.use("/trainers", authenticate, isAdminOrStaff, trainerRouter);
router.use(
  "/membership-plans",
  authenticate,
  isAdminOrStaff,
  membershipPlanRouter,
);
router.use("/pt-packages", authenticate, isAdminOrStaff, ptPackageRouter);
router.use("/vouchers", authenticate, isAdminOrStaff, voucherRouter);
router.use(
  "/member-memberships",
  authenticate,
  isAdminOrStaff,
  memberMembershipRouter,
);
router.use(
  "/member-pt-packages",
  authenticate,
  isAdminOrStaff,
  memberPtPackageRouter,
);
router.use("/payments", authenticate, isAdminOrStaff, paymentRouter);
router.use("/classes", authenticate, isAdminOrStaff, classRouter);
router.use("/class-bookings", authenticate, isAdminOrStaff, classBookingRouter);
router.use("/check-ins", authenticate, isAdminOrStaff, checkInRouter);

// ==================== ADMIN + PT ====================
// admin + pt xem lịch
router.use("/pt-bookings", authenticate, isAdminOrPT, ptBookingRouter);

// ==================== MEMBER ONLY ====================
// chỉ member — client web
router.use("/member/profile", authenticate, isMember, memberRouter);
router.use(
  "/member/memberships",
  authenticate,
  isMember,
  memberMembershipRouter,
);
router.use(
  "/member/pt-packages",
  authenticate,
  isMember,
  memberPtPackageRouter,
);
router.use("/member/classes", authenticate, isMember, classBookingRouter);
router.use("/member/pt-bookings", authenticate, isMember, ptBookingRouter);
router.use("/member/notifications", authenticate, isMember, notificationRouter);
router.use("/member/conversations", authenticate, isMember, conversationRouter);
router.use("/member/metrics", authenticate, isMember, memberMetricRouter);
router.use(
  "/member/trainer-reviews",
  authenticate,
  isMember,
  trainerReviewRouter,
);

export default router;
