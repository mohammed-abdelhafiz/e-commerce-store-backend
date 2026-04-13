import { Request, Response } from "express";
import * as couponsService from "./coupons.service";

export const getValidCouponByCode = async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const code = req.params.code as string;
  const coupon = await couponsService.getValidCouponByCode(userId, code);
  res.status(200).json({ coupon });
};
