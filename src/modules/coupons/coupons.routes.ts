import { Router } from "express";
import * as couponController from "./coupons.controller";
import { protect } from "../auth/middlewares/protect";

const router = Router();

router.get("/my-coupon", protect, couponController.getMyCoupon);

router.post("/validate/:code", protect, couponController.validateCoupon);

export default router;
