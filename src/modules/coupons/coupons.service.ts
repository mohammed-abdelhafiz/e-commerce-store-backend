import Coupon from "./Coupon.model";

export const getMyCoupon = async (userId: string) => {
  const myCoupon = await Coupon.findOne({
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
  return myCoupon;
};

export const validateCoupon = async (userId: string, code: string) => {
  const coupon = await Coupon.findOne({
    code,
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
  return coupon;
};
