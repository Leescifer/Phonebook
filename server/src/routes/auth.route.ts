import { Router } from "express";
import authController from "../controller/auth.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware.authenticate, authController.me);
router.post("/forgot-password", authController.forgotPassword);

export default router;
