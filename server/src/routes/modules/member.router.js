import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { validateParamId } from "../../middlewares/paramId.middleware.js";
import {
  createMemberSchema,
  updateMemberSchema,
} from "../../validators/member.validator.js";
import * as MemberController from "../../controllers/member.controller.js";

const router = Router();

// quyền đã được set ở main.router.js
// chỉ cần định nghĩa endpoint ở đây

router.get("/", MemberController.getAll);
router.get("/:id", validateParamId, MemberController.getById);
router.post("/", validate(createMemberSchema), MemberController.create);
router.put(
  "/:id",
  validateParamId,
  validate(updateMemberSchema),
  MemberController.update,
);
router.delete("/:id", validateParamId, MemberController.softDelete);

export default router;
