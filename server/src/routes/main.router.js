import { Router } from 'express';
import authRouter from './modules/auth.router.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import profileRouter from './modules/profile.router.js';
// import {
//   isAdmin,
//   isAdminOrStaff,
//   isAdminOrPT,
//   isMember,
// } from "../middlewares/role.middleware.js";

// import tất cả routers
// import userRouter from "./modules/user.router.js";
// import memberRouter from "./modules/member.router.js";
// import trainerRouter from "./modules/trainer.router.js";
// import membershipPlanRouter from "./modules/membership-plan.router.js";
// import ptPackageRouter from "./modules/pt-package.router.js";
// import voucherRouter from "./modules/voucher.router.js";
// import memberMembershipRouter from "./modules/member-membership.router.js";
// import memberPtPackageRouter from "./modules/member-pt-package.router.js";
// import paymentRouter from "./modules/payment.router.js";
// import classRouter from "./modules/class.router.js";
// import classBookingRouter from "./modules/class-booking.router.js";
// import ptBookingRouter from "./modules/pt-booking.router.js";
// import equipmentRouter from "./modules/equipment.router.js";
// import announcementRouter from "./modules/announcement.router.js";
// import checkInRouter from "./modules/check-in.router.js";
// import notificationRouter from "./modules/notification.router.js";
// import conversationRouter from "./modules/conversation.router.js";
// import memberMetricRouter from "./modules/member-metric.router.js";
// import trainerReviewRouter from "./modules/trainer-review.router.js";
// import blogCategoryRouter from "./modules/blog-category.router.js";
// import blogRouter from "./modules/blog.router.js";

const mainRouter = Router();

// ==================== PUBLIC ====================
// không cần đăng nhập
mainRouter.use('/auth', authRouter);
// mainRouter.use("/blogs", blogRouter); // đọc blog public
// mainRouter.use("/announcements", announcementRouter); // đọc thông báo public

// // ==================== LOGIN ====================
mainRouter.use('/profile', authenticate, profileRouter); // đọc blog public

// // ==================== ADMIN ONLY ====================
// // chỉ admin
// mainRouter.use("/users", authenticate, isAdmin, userRouter);
// mainRouter.use("/equipment", authenticate, isAdmin, equipmentRouter);

// // ==================== ADMIN + STAFF ====================
// // admin + staff
// mainRouter.use("/members", authenticate, isAdminOrStaff, memberRouter);
// mainRouter.use("/trainers", authenticate, isAdminOrStaff, trainerRouter);
// mainRouter.use(
//   "/membership-plans",
//   authenticate,
//   isAdminOrStaff,
//   membershipPlanRouter,
// );
// mainRouter.use("/pt-packages", authenticate, isAdminOrStaff, ptPackageRouter);
// mainRouter.use("/vouchers", authenticate, isAdminOrStaff, voucherRouter);
// mainRouter.use(
//   "/member-memberships",
//   authenticate,
//   isAdminOrStaff,
//   memberMembershipRouter,
// );
// mainRouter.use(
//   "/member-pt-packages",
//   authenticate,
//   isAdminOrStaff,
//   memberPtPackageRouter,
// );
// mainRouter.use("/payments", authenticate, isAdminOrStaff, paymentRouter);
// mainRouter.use("/classes", authenticate, isAdminOrStaff, classRouter);
// mainRouter.use(
//   "/class-bookings",
//   authenticate,
//   isAdminOrStaff,
//   classBookingRouter,
// );
// mainRouter.use("/check-ins", authenticate, isAdminOrStaff, checkInRouter);

// // ==================== ADMIN + PT ====================
// // admin + pt xem lịch
// mainRouter.use("/pt-bookings", authenticate, isAdminOrPT, ptBookingRouter);

// // ==================== MEMBER ONLY ====================
// // chỉ member — client web
// mainRouter.use(
//   "/member/memberships",
//   authenticate,
//   isMember,
//   memberMembershipRouter,
// );
// mainRouter.use(
//   "/member/pt-packages",
//   authenticate,
//   isMember,
//   memberPtPackageRouter,
// );
// mainRouter.use("/member/classes", authenticate, isMember, classBookingRouter);
// mainRouter.use("/member/pt-bookings", authenticate, isMember, ptBookingRouter);
// mainRouter.use(
//   "/member/notifications",
//   authenticate,
//   isMember,
//   notificationRouter,
// );
// mainRouter.use(
//   "/member/conversations",
//   authenticate,
//   isMember,
//   conversationRouter,
// );
// mainRouter.use("/member/metrics", authenticate, isMember, memberMetricRouter);
// mainRouter.use(
//   "/member/trainer-reviews",
//   authenticate,
//   isMember,
//   trainerReviewRouter,
// );

export default mainRouter;
