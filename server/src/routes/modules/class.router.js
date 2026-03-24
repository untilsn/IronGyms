import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { validateParamId } from "../../middlewares/paramId.middleware.js";
import {
  createClassSchema,
  updateClassSchema,
} from "../../validators/class.validator.js";
import * as ClassController from "../../controllers/class.controller.js";

const router = Router();

router.get("/", ClassController.getAll);
router.get("/:id", validateParamId, ClassController.getById);
router.post("/", validate(createClassSchema), ClassController.create);
router.put(
  "/:id",
  validateParamId,
  validate(updateClassSchema),
  ClassController.update,
);
router.delete("/:id", validateParamId, ClassController.cancel);

export default router;
