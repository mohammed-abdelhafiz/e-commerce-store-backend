import Coupon from "./Coupon.model";

export const getValidCouponByCode = async (userId: string, code: string) => {
  const coupon = await Coupon.findOne({
    user: userId,
    code,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
  return coupon;
};
