import { Router } from "express";
import userController from "../controller/user.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/", authMiddleware.authenticate, userController.getUsers);
router.get("/:id", authMiddleware.authenticate, userController.getUser);
router.put(
  "/:id/approve",
  authMiddleware.authenticate,
  authMiddleware.authorize("SUPER_ADMIN", "ADMIN"),
  userController.approveUser,
);
router.put(
  "/:id/deactivate",
  authMiddleware.authenticate,
  authMiddleware.authorize("SUPER_ADMIN", "ADMIN"),
  userController.deactivateUser,
);
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("SUPER_ADMIN", "ADMIN"),
  userController.updateUser,
);
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("SUPER_ADMIN", "ADMIN"),
  userController.deleteUser,
);

export default router;
