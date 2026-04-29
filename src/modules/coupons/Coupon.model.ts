import { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeCouponId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ user: 1 });
// Ensure only one active coupon per user
couponSchema.index(
  { user: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

const Coupon = model("Coupon", couponSchema);
export default Coupon;