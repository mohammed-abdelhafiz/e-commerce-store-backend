import { Router } from "express";
import * as couponController from "./coupons.controller";
import { protect } from "../auth/middlewares/protect";

const router = Router();

router.get("/:code", protect, couponController.getValidCouponByCode);

export default router;
