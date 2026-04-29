import { Router } from "express";
import * as paymentController from "./payment.controller";
import { protect } from "../auth/middlewares/protect";

const router = Router();

router.post(
  "/create-checkout-session",
  protect,
  paymentController.createCheckoutSession
);

router.post(
  "/success-checkout",
  protect,
  paymentController.handleCheckoutSuccess
);

export default router;
