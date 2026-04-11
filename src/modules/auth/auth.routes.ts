import { Router } from "express";
import * as authController from "./auth.controller";
import { protect } from "../../shared/middlewares/protect";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", protect, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", protect, authController.getMe);

export default router;
