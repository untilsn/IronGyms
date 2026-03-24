import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { checkInSchema } from "../../validators/check-in.validator.js";
import * as CheckInController from "../../controllers/check-in.controller.js";

const router = Router();

// staff scan QR → check-in
router.post("/", validate(checkInSchema), CheckInController.checkIn);

// xem lịch sử check-in
router.get("/", CheckInController.getAll);
router.get("/member/:memberId", CheckInController.getByMember);

export default router;
