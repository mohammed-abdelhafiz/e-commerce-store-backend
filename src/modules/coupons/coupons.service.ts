import { AppError } from "../../shared/lib/AppErrorClass";
import Coupon from "./Coupon.model";

export const getMyCoupon = async (userId: string) => {
  return Coupon.findOne({
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

export const validateCoupon = async (code: string, userId: string) => {
  const coupon = await Coupon.findOne({
    code,
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });

  if (!coupon) {
    throw new AppError("Invalid coupon", 400);
  }

  return coupon;
};