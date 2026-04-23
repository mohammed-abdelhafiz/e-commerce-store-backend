import { Request, Response } from "express";
import * as couponsService from "./coupons.service";

export const getMyCoupon = async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const myCoupon = await couponsService.getMyCoupon(userId);
  res.status(200).json({ myCoupon });
};

export const validateCoupon = async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const code = req.params.code as string;
  const coupon = await couponsService.validateCoupon(userId, code);
  res.status(200).json({ coupon });
};
